package message

import (
	"github.com/alphadose/haxmap"
	"github.com/cskr/pubsub/v2"
)

type Callback[T any] func(T)

type Subscriber[T any] struct {
	topic string
	ch    chan T
}

type Bus[T any] struct {
	messageBus  *pubsub.PubSub[string, T]
	subscribers *haxmap.Map[string, *Subscriber[T]] // clientId -> subscriber
}
