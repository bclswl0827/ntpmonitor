package dao

func New(database string) *DAO {
	return &DAO{database: database}
}
