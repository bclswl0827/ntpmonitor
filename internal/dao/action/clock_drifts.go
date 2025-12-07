package action

import (
	"errors"
	"time"

	"github.com/bclswl0827/ntpmonitor/internal/dao/model"
)

func (h *Handler) ClockDriftsNew(t time.Time, ref string, longTermDrift, shortTermDrift float64) error {
	if h.daoObj == nil {
		return errors.New("database is not opened")
	}

	clockDrift := model.ClockDrifts{
		Timestamp:      t.UnixMilli(),
		Reference:      ref,
		LongTermDrift:  longTermDrift,
		ShortTermDrift: shortTermDrift,
	}

	return h.daoObj.Engine.
		Table(clockDrift.Name()).
		Create(&clockDrift).
		Error
}

func (h *Handler) ClockDriftsQuery(start time.Time, end *time.Time) ([]model.ClockDrifts, error) {
	if h.daoObj == nil {
		return nil, errors.New("database is not opened")
	}

	db := h.daoObj.Engine.
		Table((&model.ClockDrifts{}).Name()).
		Where("record_timestamp >= ?", start.UnixMilli())

	if end != nil {
		db = db.Where("record_timestamp <= ?", end.UnixMilli())
	}

	var items []model.ClockDrifts
	if err := db.Order("record_timestamp ASC").Find(&items).Error; err != nil {
		return nil, err
	}

	return items, nil
}

func (h *Handler) ClockDriftsRemoveBefore(before time.Time) error {
	if h.daoObj == nil {
		return errors.New("database is not opened")
	}

	return h.daoObj.Engine.
		Table((&model.ClockDrifts{}).Name()).
		Where("record_timestamp < ?", before.UnixMilli()).
		Delete(nil).Error
}

func (h *Handler) ClockDriftsRemoveAll() error {
	if h.daoObj == nil {
		return errors.New("database is not opened")
	}

	return h.daoObj.Engine.
		Table((&model.ClockDrifts{}).Name()).
		Delete(nil).Error
}
