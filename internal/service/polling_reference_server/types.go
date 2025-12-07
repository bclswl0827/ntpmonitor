package polling_reference_server

import (
	"context"
	"sync"
	"time"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
	"github.com/bclswl0827/ntpmonitor/pkg/message"
)

type Response struct {
	Reference string
	Offset    time.Duration
}

type PollingReferenceServerImpl struct {
	mu sync.Mutex

	wg       sync.WaitGroup
	ctx      context.Context
	cancelFn context.CancelFunc

	actionHandler *action.Handler
	messageBus    message.Bus[Response]

	remoteTime RemoteTime
}
