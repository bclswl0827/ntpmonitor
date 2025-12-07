package polling_reference_server

import "time"

func (s *PollingReferenceServerImpl) Stop() {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.cancelFn()

	done := make(chan struct{})
	go func() {
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
