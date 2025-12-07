package action

import (
	"bytes"
	"encoding/gob"
	"errors"
	"fmt"
	"strings"
	"unicode"

	"github.com/bclswl0827/ntpmonitor/internal/dao/model"
)

type SettingType string

const (
	String      SettingType = "string"
	StringArray SettingType = "string[]"
	Bool        SettingType = "bool"
	Int         SettingType = "int"
	IntArray    SettingType = "int[]"
	Float       SettingType = "float"
	FloatArray  SettingType = "float[]"
)

func (h *Handler) UserSettingsGet(key string) (any, SettingType, error) {
	if h.daoObj == nil {
		return nil, "", errors.New("database is not opened")
	}

	var settings model.UserSettings
	err := h.daoObj.Engine.
		Model(settings).
		Where("config_key = ?", key).
		First(&settings).
		Error
	if err != nil {
		return nil, "", fmt.Errorf("failed to get settings for key %s: %w", key, err)
	}

	switch SettingType(settings.Type) {
	case String:
		return h.removeInvisible(string(settings.Value)), String, nil
	case Bool:
		return settings.Value[0] == 1, Bool, nil
	case Int:
		var result int64
		if err := gob.NewDecoder(bytes.NewReader(settings.Value)).Decode(&result); err != nil {
			return nil, "", fmt.Errorf("failed to decode int: %w", err)
		}
		return result, Int, nil
	case Float:
		var result float64
		if err := gob.NewDecoder(bytes.NewReader(settings.Value)).Decode(&result); err != nil {
			return nil, "", fmt.Errorf("failed to decode float: %w", err)
		}
		return result, Float, nil
	case StringArray:
		var result []string
		if err := gob.NewDecoder(bytes.NewReader(settings.Value)).Decode(&result); err != nil {
			return nil, "", fmt.Errorf("failed to decode string array: %w", err)
		}
		return result, StringArray, nil
	case IntArray:
		var result []int64
		if err := gob.NewDecoder(bytes.NewReader(settings.Value)).Decode(&result); err != nil {
			return nil, "", fmt.Errorf("failed to decode int array: %w", err)
		}
		return result, IntArray, nil
	case FloatArray:
		var result []float64
		if err := gob.NewDecoder(bytes.NewReader(settings.Value)).Decode(&result); err != nil {
			return nil, "", fmt.Errorf("failed to decode float array: %w", err)
		}
		return result, FloatArray, nil
	}

	return nil, "", fmt.Errorf("unknown data type for key %s", key)
}

func (h *Handler) UserSettingsSet(key string, valueType SettingType, value any) error {
	if h.daoObj == nil {
		return errors.New("database is not opened")
	}

	var dataValBytes []byte
	buf := new(bytes.Buffer)
	encoder := gob.NewEncoder(buf)

	switch valueType {
	case String:
		str, ok := value.(string)
		if !ok {
			return fmt.Errorf("invalid value type for %s: expected string", valueType)
		}
		dataValBytes = []byte(str)
		if len(dataValBytes) == 0 {
			dataValBytes = []byte{0}
		}
	case Bool:
		boolVal, ok := value.(bool)
		if !ok {
			return fmt.Errorf("invalid value type for %s: expected bool", valueType)
		}
		if boolVal {
			dataValBytes = []byte{1}
		} else {
			dataValBytes = []byte{0}
		}
	case Int, Float, StringArray, IntArray, FloatArray:
		if err := encoder.Encode(value); err != nil {
			return fmt.Errorf("failed to encode %s: %w", valueType, err)
		}
		dataValBytes = buf.Bytes()
	default:
		return fmt.Errorf("unsupported SettingType: %s", valueType)
	}

	settings := model.UserSettings{
		Key:   key,
		Value: dataValBytes,
		Type:  string(valueType),
	}
	err := h.daoObj.Engine.
		Model(settings).
		Where("config_key = ?", key).
		Assign(settings).
		FirstOrCreate(&settings).
		Error
	if err != nil {
		return fmt.Errorf("failed to set settings for key %s: %w", key, err)
	}

	return nil
}

func (h *Handler) UserSettingsInit(key string, valueType SettingType, value any) (bool, error) {
	if h.daoObj == nil {
		return false, errors.New("database is not opened")
	}

	settingsVal, readValueType, err := h.UserSettingsGet(key)
	if settingsVal != nil && valueType == readValueType && err == nil {
		return false, nil
	}

	err = h.UserSettingsSet(key, valueType, value)
	if err != nil {
		return false, fmt.Errorf("failed to initialize settings for key %s: %w", key, err)
	}

	return false, nil
}

func (h *Handler) removeInvisible(s string) string {
	return strings.Map(func(r rune) rune {
		if unicode.IsControl(r) {
			return -1
		}
		switch r {
		case '\u200B', '\u200C', '\u200D', '\uFEFF':
			return -1
		}
		return r
	}, s)
}
