package ntp_offset_measurement

import (
	"context"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
	"github.com/bclswl0827/ntpmonitor/internal/service/polling_reference_server"
	"github.com/bclswl0827/ntpmonitor/pkg/message"
)

func New(actionHandler *action.Handler, messageBus message.Bus[polling_reference_server.Response], remoteTimeFn polling_reference_server.RemoteTimeFunc) *NTPOffsetMeasurementImpl {
	ctx, cancelFn := context.WithCancel(context.Background())
	return &NTPOffsetMeasurementImpl{
		ctx:           ctx,
		cancelFn:      cancelFn,
		actionHandler: actionHandler,
		messageBus:    messageBus,
		RemoteTimeFn:  remoteTimeFn,
	}
}
