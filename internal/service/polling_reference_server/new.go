package polling_reference_server

import (
	"context"

	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
	"github.com/bclswl0827/ntpmonitor/pkg/message"
)

func New(actionHandler *action.Handler, messageBus message.Bus[Response]) (*PollingReferenceServerImpl, RemoteTimeFunc) {
	ctx, cancelFn := context.WithCancel(context.Background())
	impl := &PollingReferenceServerImpl{
		ctx:           ctx,
		cancelFn:      cancelFn,
		actionHandler: actionHandler,
		messageBus:    messageBus,
	}

	return impl, impl.remoteTime.Now
}
