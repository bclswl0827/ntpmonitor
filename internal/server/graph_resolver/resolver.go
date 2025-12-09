package graph_resolver

import (
	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
	"github.com/bclswl0827/ntpmonitor/internal/service/polling_reference_server"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Password      string
	ActionHandler *action.Handler
	RemoteTimeFn  polling_reference_server.RemoteTimeFunc
}

func (r *Resolver) isValidPassword(password string) bool {
	return r.Password == password
}
