package polling_reference_server

import (
	"context"
	"runtime/debug"
	"time"

	"github.com/bclswl0827/ntpmonitor/internal/settings"
	"github.com/bclswl0827/ntpmonitor/pkg/logger"
	"github.com/bclswl0827/ntpmonitor/pkg/ntpclient"
	"github.com/bclswl0827/ntpmonitor/pkg/timesource"
)

func (s *PollingReferenceServerImpl) getReferenceServerPollingInterval() time.Duration {
	setting := &settings.PollingInterval{}

	pollIntervalAny, err := setting.Get(s.actionHandler)
	if err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to get polling interval: %v", err)
		return time.Duration(setting.GetDefaultValue().(int64)) * time.Second
	}

	return time.Duration(pollIntervalAny.(int64)) * time.Second
}

func (s *PollingReferenceServerImpl) getReferenceServerPollingTimeout() time.Duration {
	setting := &settings.PollingTimeout{}

	pollTimeoutAny, err := setting.Get(s.actionHandler)
	if err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to get polling timeout: %v", err)
		return time.Duration(setting.GetDefaultValue().(int64)) * time.Second
	}

	return time.Duration(pollTimeoutAny.(int64)) * time.Second
}

func (s *PollingReferenceServerImpl) getReferenceServerRetries() int {
	setting := &settings.FailureRetries{}

	retriesAny, err := setting.Get(s.actionHandler)
	if err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to get failure retries: %v", err)
		return int(setting.GetDefaultValue().(int64))
	}

	return int(retriesAny.(int64))
}

func (s *PollingReferenceServerImpl) getCurrentReferenceServer() string {
	setting := &settings.ReferenceServer{}

	referenceServerAny, err := setting.Get(s.actionHandler)
	if err != nil {
		logger.GetLogger(s.Name()).Errorf("failed to get reference server: %v", err)
		return setting.GetDefaultValue().(string)
	}

	return referenceServerAny.(string)
}

func (s *PollingReferenceServerImpl) getCurrentReferenceOffset(server string, retries int, timeout time.Duration) (*Response, error) {
	cli, err := ntpclient.New(
		[]string{server},
		retries,
		int(timeout.Seconds()),
		timesource.MonotonicNow,
	)
	if err != nil {
		return nil, err
	}
	offset, _, err := cli.Query()
	if err != nil {
		return nil, err
	}

	s.remoteTime.setSyncedAt(timesource.MonotonicNow().Add(offset))
	s.remoteTime.setReference(server)
	s.remoteTime.setOffset(offset)

	return &Response{Offset: offset, Reference: server}, nil
}

func (s *PollingReferenceServerImpl) Start() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.ctx.Err() != nil {
		s.ctx, s.cancelFn = context.WithCancel(context.Background())
	}

	for _, setting := range []settings.IUserSetting{
		&settings.FailureRetries{},
		&settings.PollingInterval{},
		&settings.PollingTimeout{},
		&settings.PPMWindow{},
		&settings.ReferenceServer{},
		&settings.RetentionDays{},
	} {
		if err := setting.Init(s.actionHandler); err != nil {
			logger.GetLogger(s.Name()).Errorf("failed to init setting: %v", err)
		}
	}

	s.wg.Go(func() {
		defer func() {
			if r := recover(); r != nil {
				logger.GetLogger(s.Name()).Errorf("service unexpectly stopped, recovered from panic: %v\n%s", r, debug.Stack())
			}
		}()

		timer := time.NewTimer(0)
		defer timer.Stop()

		for {
			select {
			case <-timer.C:
				server, retries, timeout := s.getCurrentReferenceServer(), s.getReferenceServerRetries(), s.getReferenceServerPollingTimeout()
				if res, err := s.getCurrentReferenceOffset(server, retries, timeout); err != nil {
					logger.GetLogger(s.Name()).Errorf("failed to get current reference offset: %v", err)
				} else {
					s.messageBus.Publish("reference-offset", *res)
				}

				timer.Reset(s.getReferenceServerPollingInterval())
			case <-s.ctx.Done():
				return
			}
		}
	})
}
