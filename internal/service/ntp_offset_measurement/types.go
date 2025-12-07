package ntp_offset_measurement

import (
	"context"
	"sync"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
	"github.com/bclswl0827/ntpmonitor/internal/service/polling_reference_server"
	"github.com/bclswl0827/ntpmonitor/pkg/message"
)

type NTPOffsetMeasurementImpl struct {
	mu sync.Mutex

	wg       sync.WaitGroup
	ctx      context.Context
	cancelFn context.CancelFunc

	actionHandler *action.Handler
	RemoteTimeFn  polling_reference_server.RemoteTimeFunc
	messageBus    message.Bus[polling_reference_server.Response]
}
