package settings

import (
	"fmt"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
)

type FailureRetries struct{}

func (s *FailureRetries) GetKey() string              { return "failure_retries" }
func (s *FailureRetries) GetType() action.SettingType { return action.Int }
func (s *FailureRetries) GetOptions() map[string]any  { return nil }
func (s *FailureRetries) GetDefaultValue() any        { return 3 }
func (s *FailureRetries) Init(handler *action.Handler) error {
	if _, err := handler.UserSettingsInit(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to set default failure retries: %w", err)
	}
	return nil
}
func (s *FailureRetries) Set(handler *action.Handler, newVal any) error {
	typedVal, err := GetConfigValInt64(newVal)
	if err != nil {
		return err
	}
	if typedVal < 0 || typedVal > 10 {
		return fmt.Errorf("invalid failure retries value (must be between 0 and 10), got %d", typedVal)
	}
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), typedVal); err != nil {
		return fmt.Errorf("failed to set failure retries: %w", err)
	}
	return nil
}
func (s *FailureRetries) Get(handler *action.Handler) (any, error) {
	val, _, err := handler.UserSettingsGet(s.GetKey())
	if err != nil {
		return nil, fmt.Errorf("failed to get failure retries: %w", err)
	}
	typedVal, err := GetConfigValInt64(val)
	if err != nil {
		return nil, fmt.Errorf("failed to assert failure retries: %w", err)
	}
	return typedVal, nil
}
func (s *FailureRetries) Restore(handler *action.Handler) error {
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to reset failure retries: %w", err)
	}
	return nil
}
