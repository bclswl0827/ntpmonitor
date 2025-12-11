package action

import (
	"errors"

	"github.com/bclswl0827/ntpmonitor/internal/dao/model"
	"github.com/google/uuid"
)

func (s *Handler) NtpServersNew(name, address, remark string) error {
	if s.daoObj == nil {
		return errors.New("database is not opened")
	}

	obj := model.NtpServers{
		ServerUUID: uuid.New().String(),
		ServerName: name,
		Remark:     remark,
		Address:    address,
	}

	return s.daoObj.Engine.
		Table(obj.Name()).
		Create(&obj).Error
}

func (s *Handler) NtpServersList() (map[string]model.NtpServers, error) {
	if s.daoObj == nil {
		return nil, errors.New("database is not opened")
	}

	var items []model.NtpServers
	err := s.daoObj.Engine.
		Table((&model.NtpServers{}).Name()).
		Order("updated_at DESC").
		Find(&items).Error
	if err != nil {
		return nil, err
	}

	result := make(map[string]model.NtpServers, len(items))
	for _, item := range items {
		result[item.Address] = item
	}

	return result, nil
}

func (s *Handler) NtpServersFindByAddress(address string) (model.NtpServers, error) {
	if s.daoObj == nil {
		return model.NtpServers{}, errors.New("database is not opened")
	}

	var item model.NtpServers
	err := s.daoObj.Engine.
		Table((&model.NtpServers{}).Name()).
		Where("server_addr = ?", address).
		First(&item).Error
	if err != nil {
		return model.NtpServers{}, err
	}

	return item, nil
}

func (s *Handler) NtpServersFindByUUID(uuid string) (model.NtpServers, error) {
	if s.daoObj == nil {
		return model.NtpServers{}, errors.New("database is not opened")
	}

	var item model.NtpServers
	err := s.daoObj.Engine.
		Table((&model.NtpServers{}).Name()).
		Where("server_uuid = ?", uuid).
		First(&item).Error
	if err != nil {
		return model.NtpServers{}, err
	}

	return item, nil
}

func (s *Handler) NtpServersRemove(serverUUID string) error {
	if s.daoObj == nil {
		return errors.New("database is not opened")
	}

	return s.daoObj.Engine.
		Table((&model.NtpServers{}).Name()).
		Where("server_uuid = ?", serverUUID).
		Delete(nil).Error
}

func (s *Handler) NtpServersUpdate(serverUUID string, name, address, remark *string) error {
	if s.daoObj == nil {
		return errors.New("database is not opened")
	}

	updates := make(map[string]any)

	if name != nil {
		updates["server_name"] = *name
	}
	if address != nil {
		updates["server_addr"] = *address
	}
	if remark != nil {
		updates["server_remark"] = *remark
	}

	if len(updates) == 0 {
		return nil
	}

	return s.daoObj.Engine.
		Table((&model.NtpServers{}).Name()).
		Where("server_uuid = ?", serverUUID).
		Updates(updates).Error
}
