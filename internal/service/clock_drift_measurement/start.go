package clock_drift_measurement

import (
	"context"
	"runtime/debug"
	"time"

	"github.com/bclswl0827/ntpmonitor/internal/service/polling_reference_server"
	"github.com/bclswl0827/ntpmonitor/internal/settings"
	"github.com/bclswl0827/ntpmonitor/pkg/logger"
	"github.com/bclswl0827/ntpmonitor/pkg/ringbuf"
	"github.com/bclswl0827/ntpmonitor/pkg/timesource"
)

func (s *ClockDriftMeasurementImpl) getLongTermPPMWindow() time.Duration {
	setting := &settings.PPMWindow{}

	ppmWindowAny, err := setting.Get(s.actionHandler)
	if err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to get ppm measurement window: %v", err)
		return time.Duration(setting.GetDefaultValue().(int64)) * time.Minute
	}

	return time.Duration(ppmWindowAny.(int64)) * time.Minute
}

func (s *ClockDriftMeasurementImpl) trimWindow(now time.Time, ppmWindow time.Duration) {
	cutoff := now.Add(-ppmWindow)
	vals := s.longBuf.Values()

	idx := 0
	for idx < len(vals) && vals[idx].measuredAt.Before(cutoff) {
		idx++
	}

	if idx > 0 {
		newList := vals[idx:]
		s.longBuf.Reset()
		s.longBuf.Push(newList...)
	}
}

func (s *ClockDriftMeasurementImpl) getLongTermPPM() float64 {
	vals := s.longBuf.Values()
	if len(vals) <= 1 {
		return 0
	}

	oldest := vals[0]
	newest := vals[len(vals)-1]

	// dt in seconds (monotonic)
	dt := newest.measuredAt.Sub(oldest.measuredAt).Seconds()
	if dt <= 0 {
		return 0
	}

	// dOffset in seconds (use Seconds())
	dOffset := (newest.offset - oldest.offset).Seconds()
	return dOffset / dt * 1e6
}

func (s *ClockDriftMeasurementImpl) getShortTermPPM(offset time.Duration, measuredMono time.Time) (float64, bool) {
	if !s.haveLast {
		return 0, false
	}

	dt := measuredMono.Sub(s.lastAt).Seconds()
	if dt <= 0 {
		return 0, false
	}

	dOffset := (offset - s.lastOffset).Seconds()
	rawPPM := dOffset / dt * 1e6

	if !s.shortInit {
		s.shortIIR = rawPPM
		s.shortInit = true
	} else {
		s.shortIIR = s.shortIIR*(1-s.alpha) + rawPPM*s.alpha
	}

	return s.shortIIR, true
}

func (s *ClockDriftMeasurementImpl) measureClockDrift(r polling_reference_server.Response, ppmWindow time.Duration) {
	remoteTime, err := s.RemoteTimeFn()
	if err != nil {
		return
	}

	measuredMono := timesource.MonotonicNow()
	shortPPM, ok := s.getShortTermPPM(r.Offset, measuredMono)
	if !ok {
		shortPPM = 0
	}

	s.lastOffset = r.Offset
	s.lastAt = measuredMono
	s.haveLast = true

	s.longBuf.Push(driftItem{offset: r.Offset, measuredAt: measuredMono})
	s.trimWindow(measuredMono, ppmWindow)
	longPPM := s.getLongTermPPM()

	if s.longBuf.Len() >= 2 && s.shortInit {
		if err := s.actionHandler.ClockDriftsNew(remoteTime, r.Reference, longPPM, shortPPM); err != nil {
			logger.GetLogger(s.Name()).Errorf("failed to write clock drift into database: %v", err)
		}
		logger.GetLogger(s.Name()).Infof("reference_server=%s long_term_ppm=%.2fppm short_term_ppm=%.2fppm", r.Reference, longPPM, shortPPM)
	}
}

func (s *ClockDriftMeasurementImpl) initMeasurement(ppmWindow time.Duration) {
	s.longBuf = ringbuf.New[driftItem](int(ppmWindow.Seconds()) * 2)
	s.alpha = 0.05
}

func (s *ClockDriftMeasurementImpl) Start() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.ctx.Err() != nil {
		s.ctx, s.cancelFn = context.WithCancel(context.Background())
	}

	ppmWindow := s.getLongTermPPMWindow()
	s.initMeasurement(ppmWindow)

	s.wg.Go(func() {
		defer func() {
			if r := recover(); r != nil {
				logger.GetLogger(s.Name()).Errorf("service unexpectly stopped, recovered from panic: %v\n%s", r, debug.Stack())
			}
		}()

		s.messageBus.Subscribe("reference-offset", s.Name(), func(r polling_reference_server.Response) { s.measureClockDrift(r, ppmWindow) })
		<-s.ctx.Done()
	})
}
