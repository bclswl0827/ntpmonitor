package main

import (
	"fmt"

	"github.com/bclswl0827/ntpmonitor/pkg/logger"
)

func setupLogger(level string) error {
	var err error
	switch level {
	case "info":
		err = logger.SetLevel(logger.INFO)
	case "warn":
		err = logger.SetLevel(logger.WARN)
	case "error":
		err = logger.SetLevel(logger.ERROR)
	default:
		return fmt.Errorf("unknown log level: %s", level)
	}
	if err != nil {
		return fmt.Errorf("failed to set log level: %w", err)
	}

	return nil
}
