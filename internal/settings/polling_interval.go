package settings

import (
	"fmt"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
)

type PollingInterval struct{}

func (s *PollingInterval) GetKey() string              { return "polling_interval" }
func (s *PollingInterval) GetType() action.SettingType { return action.Int }
func (s *PollingInterval) GetOptions() map[string]any  { return nil }
func (s *PollingInterval) GetDefaultValue() any        { return 30 }
func (s *PollingInterval) Init(handler *action.Handler) error {
	if _, err := handler.UserSettingsInit(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to set default polling interval: %w", err)
	}
	return nil
}
func (s *PollingInterval) Set(handler *action.Handler, newVal any) error {
	typedVal, err := GetConfigValInt64(newVal)
	if err != nil {
		return err
	}
	if typedVal < 1 || typedVal > 86400 {
		return fmt.Errorf("invalid polling interval value (must be between 1 and 86400), got %d", typedVal)
	}
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), typedVal); err != nil {
		return fmt.Errorf("failed to set polling interval: %w", err)
	}
	return nil
}
func (s *PollingInterval) Get(handler *action.Handler) (any, error) {
	val, _, err := handler.UserSettingsGet(s.GetKey())
	if err != nil {
		return nil, fmt.Errorf("failed to get polling interval: %w", err)
	}
	typedVal, err := GetConfigValInt64(val)
	if err != nil {
		return nil, fmt.Errorf("failed to assert polling interval: %w", err)
	}
	return typedVal, nil
}
func (s *PollingInterval) Restore(handler *action.Handler) error {
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to reset polling interval: %w", err)
	}
	return nil
}
