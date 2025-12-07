package clock_drift_measurement

import (
	"context"
	"sync"
	"time"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
	"github.com/bclswl0827/ntpmonitor/internal/service/polling_reference_server"
	"github.com/bclswl0827/ntpmonitor/pkg/message"
	"github.com/bclswl0827/ntpmonitor/pkg/ringbuf"
)

type driftItem struct {
	offset     time.Duration
	measuredAt time.Time
}

type ClockDriftMeasurementImpl struct {
	mu sync.Mutex

	wg       sync.WaitGroup
	ctx      context.Context
	cancelFn context.CancelFunc

	// Long-term drift
	longBuf *ringbuf.Buffer[driftItem]

	// Short-term drift
	lastOffset time.Duration
	lastAt     time.Time
	haveLast   bool
	shortInit  bool
	shortIIR   float64
	alpha      float64

	actionHandler *action.Handler
	messageBus    message.Bus[polling_reference_server.Response]
	RemoteTimeFn  polling_reference_server.RemoteTimeFunc
}
