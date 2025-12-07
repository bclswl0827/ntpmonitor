package settings

import (
	"fmt"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
)

type PPMWindow struct{}

func (s *PPMWindow) GetKey() string              { return "ppm_window" }
func (s *PPMWindow) GetType() action.SettingType { return action.Int }
func (s *PPMWindow) GetOptions() map[string]any  { return nil }
func (s *PPMWindow) GetDefaultValue() any        { return 60 }
func (s *PPMWindow) Init(handler *action.Handler) error {
	if _, err := handler.UserSettingsInit(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to set default ppm measurement window: %w", err)
	}
	return nil
}
func (s *PPMWindow) Set(handler *action.Handler, newVal any) error {
	typedVal, err := GetConfigValInt64(newVal)
	if err != nil {
		return err
	}
	if typedVal < 1 {
		return fmt.Errorf("invalid ppm measurement window value (must be more than 1), got %d", typedVal)
	}
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), typedVal); err != nil {
		return fmt.Errorf("failed to set ppm measurement window: %w", err)
	}
	return nil
}
func (s *PPMWindow) Get(handler *action.Handler) (any, error) {
	val, _, err := handler.UserSettingsGet(s.GetKey())
	if err != nil {
		return nil, fmt.Errorf("failed to get ppm measurement window: %w", err)
	}
	typedVal, err := GetConfigValInt64(val)
	if err != nil {
		return nil, fmt.Errorf("failed to assert ppm measurement window: %w", err)
	}
	return typedVal, nil
}
func (s *PPMWindow) Restore(handler *action.Handler) error {
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to reset ppm measurement window: %w", err)
	}
	return nil
}
