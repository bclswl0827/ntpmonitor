package model

import "github.com/bclswl0827/ntpmonitor/internal/dao"

type ClockDrifts struct {
	dao.BaseTable

	Timestamp      int64   `gorm:"column:record_timestamp;index;not null"`
	LongTermDrift  float64 `gorm:"column:long_term_drift;not null"`
	ShortTermDrift float64 `gorm:"column:short_term_drift;not null"`

	Reference string `gorm:"column:reference_server;index;not null"`
}

func (t *ClockDrifts) Model() any {
	return t
}

func (t *ClockDrifts) Name() string {
	return "clock_drifts"
}

func (t *ClockDrifts) UseAutoMigrate() bool {
	return true
}
