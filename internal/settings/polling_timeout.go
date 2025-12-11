package settings

import (
	"fmt"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
)

type PollingTimeout struct{}

func (s *PollingTimeout) GetKey() string              { return "polling_timeout" }
func (s *PollingTimeout) GetType() action.SettingType { return action.Int }
func (s *PollingTimeout) GetOptions() map[string]any  { return nil }
func (s *PollingTimeout) GetDefaultValue() any        { return 5 }
func (s *PollingTimeout) Init(handler *action.Handler) error {
	if _, err := handler.UserSettingsInit(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to set default polling timeout: %w", err)
	}
	return nil
}
func (s *PollingTimeout) Set(handler *action.Handler, newVal any) error {
	typedVal, err := GetConfigValInt64(newVal)
	if err != nil {
		return err
	}
	if typedVal < 1 || typedVal > 300 {
		return fmt.Errorf("invalid polling timeout value (must be between 1 and 60), got %d", typedVal)
	}
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), typedVal); err != nil {
		return fmt.Errorf("failed to set polling timeout: %w", err)
	}
	return nil
}
func (s *PollingTimeout) Get(handler *action.Handler) (any, error) {
	val, _, err := handler.UserSettingsGet(s.GetKey())
	if err != nil {
		return nil, fmt.Errorf("failed to get polling timeout: %w", err)
	}
	typedVal, err := GetConfigValInt64(val)
	if err != nil {
		return nil, fmt.Errorf("failed to assert polling timeout: %w", err)
	}
	return typedVal, nil
}
func (s *PollingTimeout) Restore(handler *action.Handler) error {
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to reset polling timeout: %w", err)
	}
	return nil
}
