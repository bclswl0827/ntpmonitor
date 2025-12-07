//go:build !mips && !mips64 && !mipsle && !mips64le && !windows && !openbsd
// +build !mips,!mips64,!mipsle,!mips64le,!windows,!openbsd

package sqlite

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/bclswl0827/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func isBaseDirExists(database string) (string, bool) {
	baseDir := filepath.Dir(database)
	if _, err := os.Stat(baseDir); os.IsNotExist(err) {
		return baseDir, false
	}

	return baseDir, true
}

func createDSN(database string) string {
	return fmt.Sprintf("%s?_pragma=synchronous(NORMAL)&_pragma=cache_size(-20000)&_pragma=temp_store(MEMORY)&_pragma=foreign_keys(ON)&_pragma=auto_vacuum(FULL)", database)
}

func New(database string) (*gorm.DB, error) {
	if baseDir, ok := isBaseDirExists(database); !ok {
		return nil, fmt.Errorf("directory %s does not exist", baseDir)
	}

	db, err := gorm.Open(sqlite.Open(createDSN(database)), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxOpenConns(1)
	return db, nil
}
