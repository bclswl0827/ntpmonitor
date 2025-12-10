package settings

import (
	"fmt"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
)

type RetentionDays struct{}

func (s *RetentionDays) GetKey() string              { return "retention_days" }
func (s *RetentionDays) GetType() action.SettingType { return action.Int }
func (s *RetentionDays) GetOptions() map[string]any  { return nil }
func (s *RetentionDays) GetDefaultValue() any        { return 90 }
func (s *RetentionDays) Init(handler *action.Handler) error {
	if _, err := handler.UserSettingsInit(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to set default retention days: %w", err)
	}
	return nil
}
func (s *RetentionDays) Set(handler *action.Handler, newVal any) error {
	typedVal, err := GetConfigValInt64(newVal)
	if err != nil {
		return err
	}
	if typedVal < 0 {
		return fmt.Errorf("invalid retention days value (must be more than 0), got %d", typedVal)
	}
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), typedVal); err != nil {
		return fmt.Errorf("failed to set retention days: %w", err)
	}
	return nil
}
func (s *RetentionDays) Get(handler *action.Handler) (any, error) {
	val, _, err := handler.UserSettingsGet(s.GetKey())
	if err != nil {
		return nil, fmt.Errorf("failed to get retention days: %w", err)
	}
	typedVal, err := GetConfigValInt64(val)
	if err != nil {
		return nil, fmt.Errorf("failed to assert retention days: %w", err)
	}
	return typedVal, nil
}
func (s *RetentionDays) Restore(handler *action.Handler) error {
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to reset retention days: %w", err)
	}
	return nil
}
