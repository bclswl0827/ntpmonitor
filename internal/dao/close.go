package dao

import "errors"

func (t *DAO) Close() error {
	if t.Engine == nil {
		return errors.New("database is not opened")
	}

	sqlDB, err := t.Engine.DB()
	if err != nil {
		return err
	}

	return sqlDB.Close()
}
