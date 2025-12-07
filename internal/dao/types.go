package dao

import (
	"gorm.io/gorm"
)

type DAO struct {
	database string
	Engine   *gorm.DB
}

type BaseTable struct {
	PrimaryKey uint64 `gorm:"column:id;primaryKey;autoIncrement"`
	CreatedAt  int64  `gorm:"column:created_at;autoUpdateTime:milli;<-:create"`
}

type ITable interface {
	Model() any
	Name() string
	UseAutoMigrate() bool
}
