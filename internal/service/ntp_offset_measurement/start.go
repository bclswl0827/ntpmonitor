package ntp_offset_measurement

import (
	"context"
	"runtime/debug"
	"sync/atomic"
	"time"

	"github.com/bclswl0827/ntpmonitor/internal/dao/model"
	"github.com/bclswl0827/ntpmonitor/internal/service/polling_reference_server"
	"github.com/bclswl0827/ntpmonitor/internal/settings"
	"github.com/bclswl0827/ntpmonitor/pkg/logger"
	"github.com/bclswl0827/ntpmonitor/pkg/ntpclient"
	"github.com/bclswl0827/ntpmonitor/pkg/timesource"
	"github.com/samber/lo"
)

func (s *NTPOffsetMeasurementImpl) getObserveServerPollingTimeout() time.Duration {
	setting := &settings.PollingTimeout{}

	pollTimeoutAny, err := setting.Get(s.actionHandler)
	if err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to get polling timeout: %v", err)
		return time.Duration(setting.GetDefaultValue().(int64)) * time.Second
	}

	return time.Duration(pollTimeoutAny.(int64)) * time.Second
}

func (s *NTPOffsetMeasurementImpl) measureNTPOffset(r polling_reference_server.Response, timeout time.Duration) {
	servers, err := s.actionHandler.NtpServersList()
	if err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to get ntp servers list: %v", err)
		return
	}
	if len(servers) == 0 {
		logger.GetLogger(s.Name()).Warnf("no observe NTP server configured, skip measurement")
		return
	}

	results := ntpclient.Probe(
		lo.MapToSlice(servers, func(_ string, s model.NtpServers) string { return s.Address }),
		timeout,
		timesource.MonotonicNow,
	)

	for _, res := range results {
		if res.Err != nil {
			logger.GetLogger(s.Name()).Warnf("failed to query NTP server %s: %v", res.Server, res.Err)
			continue
		}

		remoteTime, _, _, err := s.RemoteTimeFn()
		if err != nil {
			continue
		}

		offset := r.Offset - res.Resp.ClockOffset
		if err := s.actionHandler.ServerOffsetsNew(
			remoteTime,
			r.Reference,
			servers[res.Server].ServerUUID,
			offset.Milliseconds(),
			res.Resp,
		); err != nil {
			logger.GetLogger(s.Name()).Errorf("failed to save offset for server %s: %v", res.Server, err)
		}
	}
}

func (s *NTPOffsetMeasurementImpl) purgeExpiredData() {
	retentionAny, err := (&settings.RetentionDays{}).Get(s.actionHandler)
	if err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to get data retention days: %v", err)
		return
	}
	retention := time.Duration(retentionAny.(int64)) * 24 * time.Hour

	now, _, _, err := s.RemoteTimeFn()
	if err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to get remote time: %v", err)
		return
	}

	logger.GetLogger(s.Name()).Infof("purging expired NTP offset records before %s", now.Add(-retention).Format(time.RFC3339))
	if err := s.actionHandler.ServerOffsetsRemoveBefore(now.Add(-retention)); err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to remove expired NTP offset records: %v", err)
	}
}

func (s *NTPOffsetMeasurementImpl) Start() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.ctx.Err() != nil {
		s.ctx, s.cancelFn = context.WithCancel(context.Background())
	}

	// 0 = idle, 1 = running
	var measurementRunning int32

	s.wg.Go(func() {
		defer func() {
			if r := recover(); r != nil {
				logger.GetLogger(s.Name()).Errorf(
					"service unexpectly stopped, recovered from panic: %v\n%s", r, debug.Stack())
			}
		}()

		s.messageBus.Subscribe("reference-offset", s.Name(), func(r polling_reference_server.Response) {
			if !atomic.CompareAndSwapInt32(&measurementRunning, 0, 1) {
				logger.GetLogger(s.Name()).Warnf("previous NTP server offset measurement still running, skip this event")
				return
			}
			defer atomic.StoreInt32(&measurementRunning, 0)

			s.measureNTPOffset(r, s.getObserveServerPollingTimeout())
			s.purgeExpiredData()
		})

		<-s.ctx.Done()
	})
}
