package message

import (
	"github.com/alphadose/haxmap"
	"github.com/cskr/pubsub/v2"
)

func NewBus[T any]() Bus[T] {
	return Bus[T]{
		messageBus:  pubsub.New[string, T](0),
		subscribers: haxmap.New[string, *Subscriber[T]](),
	}
}
