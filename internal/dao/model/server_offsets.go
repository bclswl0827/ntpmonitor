package model

import "github.com/bclswl0827/ntpmonitor/internal/dao"

type ServerOffsets struct {
	dao.BaseTable

	Timestamp int64  `gorm:"column:record_timestamp;index;not null"`
	Reference string `gorm:"column:reference_server;index;not null"`
	Offset    int64  `gorm:"column:clock_offset;not null"`

	RoundTrip      int64 `gorm:"column:round_trip;not null"`
	RootDelay      int64 `gorm:"column:root_delay;not null"`
	RootDispersion int64 `gorm:"column:root_dispersion;not null"`
	RootDistance   int64 `gorm:"column:root_distance;not null"`

	Stratum     int    `gorm:"column:server_stratum;not null"`
	ServerRefId string `gorm:"column:server_ref_id"`

	ServerUUID string `gorm:"column:server_uuid;index;not null"`
}

func (t *ServerOffsets) Model() any {
	return t
}

func (t *ServerOffsets) Name() string {
	return "server_offsets"
}

func (t *ServerOffsets) UseAutoMigrate() bool {
	return true
}
