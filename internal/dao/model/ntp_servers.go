package model

import "github.com/bclswl0827/ntpmonitor/internal/dao"

type NtpServers struct {
	dao.BaseTable

	ServerUUID string `gorm:"column:server_uuid;index;unique;not null"`
	ServerName string `gorm:"column:server_name;index;unique;not null"`
	Remark     string `gorm:"column:server_remark"`
	Address    string `gorm:"column:server_addr;index;unique;not null"`
	UpdatedAt  int64  `gorm:"column:updated_at;autoUpdateTime:milli"`

	Offsets []ServerOffsets `gorm:"foreignKey:ServerUUID;references:ServerUUID;constraint:OnDelete:CASCADE;"`
}

func (t *NtpServers) Model() any {
	return t
}

func (t *NtpServers) Name() string {
	return "ntp_servers"
}

func (t *NtpServers) UseAutoMigrate() bool {
	return true
}
