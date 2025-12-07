package settings

import "github.com/bclswl0827/ntpmonitor/internal/dao/action"

func Init(handler *action.Handler) error {
	settings := []IUserSetting{
		&PollingInterval{},
		&ReferenceServer{},
	}
	for _, setting := range settings {
		if err := setting.Init(handler); err != nil {
			return err
		}
	}

	return nil
}
