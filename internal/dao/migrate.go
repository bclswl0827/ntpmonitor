package dao

import (
	"fmt"
)

func (d *DAO) Migrate(tables ...ITable) error {
	if d.Engine == nil {
		return fmt.Errorf("database is not opened")
	}

	for _, table := range tables {
		if !table.UseAutoMigrate() {
			continue
		}

		tableRecord, tableName := table.Model(), table.Name()
		if err := d.Engine.AutoMigrate(tableRecord); err != nil {
			return fmt.Errorf("failed to auto migrate %s table: %w", tableName, err)
		}
	}

	return nil
}
