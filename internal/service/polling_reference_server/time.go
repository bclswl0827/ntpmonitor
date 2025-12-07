package polling_reference_server

import (
	"errors"
	"sync"
	"time"

	"github.com/bclswl0827/ntpmonitor/pkg/timesource"
)

type RemoteTimeFunc func() (time.Time, error)

type RemoteTime struct {
	mu     sync.Mutex
	offset *time.Duration
}

func (r *RemoteTime) setOffset(offset time.Duration) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.offset = &offset
}

func (r *RemoteTime) Now() (time.Time, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.offset == nil {
		return time.Time{}, errors.New("remote time is not initialized")
	}

	return timesource.MonotonicNow().Add(*r.offset), nil
}
