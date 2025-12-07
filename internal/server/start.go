package server

import (
	"fmt"
	"net/http"
)

func (s *httpServer) Start() error {
	s.log.Infof("starting http server at %s", s.server.Addr)
	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("failed to start http server: %w", err)
	}

	return nil
}
