package action

import (
	"errors"
	"time"

	"github.com/bclswl0827/ntpmonitor/internal/dao/model"
	"github.com/beevik/ntp"
)

func (s *Handler) ServerOffsetsNew(t time.Time, reference, serverUUID string, offset int64, resp *ntp.Response) error {
	if s.daoObj == nil {
		return errors.New("database is not opened")
	}

	obj := model.ServerOffsets{
		Timestamp:      t.UnixMilli(),
		ServerUUID:     serverUUID,
		Reference:      reference,
		Offset:         offset,
		RoundTrip:      resp.RTT.Milliseconds(),
		RootDelay:      resp.RootDelay.Milliseconds(),
		RootDispersion: resp.RootDispersion.Milliseconds(),
		RootDistance:   resp.RootDistance.Milliseconds(),
		Stratum:        int(resp.Stratum),
		ServerRefId:    resp.ReferenceString(),
	}

	return s.daoObj.Engine.
		Table(obj.Name()).
		Create(&obj).Error
}

func (s *Handler) ServerOffsetsQuery(serverUUID string, start time.Time, end *time.Time) ([]model.ServerOffsets, error) {
	if s.daoObj == nil {
		return nil, errors.New("database is not opened")
	}

	db := s.daoObj.Engine.
		Table((&model.ServerOffsets{}).Name()).
		Where("server_uuid = ?", serverUUID).
		Where("record_timestamp >= ?", start.UnixMilli())

	if end != nil {
		db = db.Where("record_timestamp <= ?", end.UnixMilli())
	}

	var items []model.ServerOffsets
	err := db.Order("record_timestamp DESC").Find(&items).Error
	if err != nil {
		return nil, err
	}

	return items, nil
}

func (s *Handler) ServerOffsetsRemoveBefore(before time.Time) error {
	if s.daoObj == nil {
		return errors.New("database is not opened")
	}

	return s.daoObj.Engine.
		Table((&model.ServerOffsets{}).Name()).
		Where("record_timestamp < ?", before.UnixMilli()).
		Delete(nil).Error
}

func (s *Handler) ServerOffsetsRemoveAll() error {
	if s.daoObj == nil {
		return errors.New("database is not opened")
	}

	return s.daoObj.Engine.
		Table((&model.ServerOffsets{}).Name()).
		Delete(nil).Error
}
