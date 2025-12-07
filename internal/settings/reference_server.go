package settings

import (
	"fmt"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
	"github.com/bclswl0827/ntpmonitor/pkg/ntpclient"
)

type ReferenceServer struct{}

func (s *ReferenceServer) GetKey() string              { return "reference_server" }
func (s *ReferenceServer) GetType() action.SettingType { return action.String }
func (s *ReferenceServer) GetOptions() map[string]any  { return nil }
func (s *ReferenceServer) GetDefaultValue() any        { return "time.cloudflare.com:123" }
func (s *ReferenceServer) Init(handler *action.Handler) error {
	if _, err := handler.UserSettingsInit(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to set default reference server: %w", err)
	}
	return nil
}
func (s *ReferenceServer) Set(handler *action.Handler, newVal any) error {
	typedVal, err := GetConfigValString(newVal)
	if err != nil {
		return err
	}
	fixedAddr, err := ntpclient.FixHostPort(typedVal, 123)
	if err != nil {
		return err
	}
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), fixedAddr); err != nil {
		return fmt.Errorf("failed to set reference server: %w", err)
	}
	return nil
}
func (s *ReferenceServer) Get(handler *action.Handler) (any, error) {
	val, _, err := handler.UserSettingsGet(s.GetKey())
	if err != nil {
		return nil, fmt.Errorf("failed to get reference server: %w", err)
	}
	typedVal, err := GetConfigValString(val)
	if err != nil {
		return nil, fmt.Errorf("failed to assert reference server: %w", err)
	}
	return typedVal, nil
}
func (s *ReferenceServer) Restore(handler *action.Handler) error {
	if err := handler.UserSettingsSet(s.GetKey(), s.GetType(), s.GetDefaultValue()); err != nil {
		return fmt.Errorf("failed to reset reference server: %w", err)
	}
	return nil
}
