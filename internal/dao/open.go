package dao

import (
	"errors"
	"fmt"

	"github.com/bclswl0827/ntpmonitor/pkg/sqlite"
)

func (d *DAO) Open() error {
	if d.Engine != nil {
		return errors.New("database is already opened")
	}

	if d.database == "" {
		return errors.New("database path is not set")
	}

	engine, err := sqlite.New(d.database)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}
	d.Engine = engine

	return nil
}
