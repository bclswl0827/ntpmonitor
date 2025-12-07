package settings

import "github.com/bclswl0827/ntpmonitor/internal/dao/action"

type IUserSetting interface {
	GetDefaultValue() any

	GetType() action.SettingType
	GetKey() string // unique identifier
	GetOptions() map[string]any

	Init(handler *action.Handler) error // should be initialized during startup hook
	Set(handler *action.Handler, newVal any) error
	Get(handler *action.Handler) (any, error)
	Restore(handler *action.Handler) error
}
