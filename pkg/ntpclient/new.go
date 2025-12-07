package ntpclient

import (
	"fmt"
	"time"
)

func New(pool []string, retries int, timeout int, timeFunc TimeFunc) (Client, error) {
	if len(pool) == 0 {
		return Client{}, fmt.Errorf("NTP pool is empty")
	}

	if timeFunc == nil {
		timeFunc = time.Now
	}

	return Client{
		timeFunc:    timeFunc,
		pool:        pool,
		retries:     retries,
		readTimeout: time.Duration(timeout) * time.Second,
	}, nil
}
