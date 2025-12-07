package service

type IService interface {
	Start()
	Stop()
	Name() string
}
