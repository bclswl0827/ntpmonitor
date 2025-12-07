package action

import "github.com/bclswl0827/ntpmonitor/internal/dao"

func New(daoObj *dao.DAO) *Handler {
	return &Handler{
		daoObj: daoObj,
	}
}
