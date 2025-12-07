package ntp_offset_measurement

import (
	"time"
)

func (s *NTPOffsetMeasurementImpl) Stop() {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.cancelFn()

	done := make(chan struct{})
	go func() {
		_ = s.messageBus.Unsubscribe(s.Name())
		s.wg.Wait()
		close(done)
	}()

	timer := time.NewTimer(3 * time.Second)
	defer timer.Stop()

	select {
	case <-done:
		return
	case <-timer.C:
		return
	}
}
