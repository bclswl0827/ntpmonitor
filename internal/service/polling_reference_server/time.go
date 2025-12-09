package polling_reference_server

import (
	"errors"
	"sync"
	"time"

	"github.com/bclswl0827/ntpmonitor/pkg/timesource"
)

type RemoteTimeFunc func() (current time.Time, syncedAt time.Time, reference string, err error)

type RemoteTime struct {
	mu        sync.Mutex
	reference string
	syncedAt  time.Time
	offset    *time.Duration
}

func (r *RemoteTime) setOffset(offset time.Duration) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.offset = &offset
}

func (r *RemoteTime) setReference(reference string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.reference = reference
}

func (r *RemoteTime) setSyncedAt(syncedAt time.Time) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.syncedAt = syncedAt
}

func (r *RemoteTime) Now() (time.Time, time.Time, string, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.offset == nil {
		return time.Time{}, time.Time{}, "", errors.New("remote time is not initialized")
	}

	return timesource.MonotonicNow().Add(*r.offset), r.syncedAt, r.reference, nil
}
