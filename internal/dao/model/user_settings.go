package model

import "github.com/bclswl0827/ntpmonitor/internal/dao"

type UserSettings struct {
	dao.BaseTable

	Type  string `gorm:"column:config_type;not null"`
	Key   string `gorm:"column:config_key;index;not null"`
	Value []byte `gorm:"column:config_value;not null"`

	UpdatedAt int64 `gorm:"column:update_at;autoUpdateTime:milli;<-:update"`
}

func (t *UserSettings) Model() any {
	return t
}

func (t *UserSettings) Name() string {
	return "user_settings"
}

func (t *UserSettings) UseAutoMigrate() bool {
	return true
}
