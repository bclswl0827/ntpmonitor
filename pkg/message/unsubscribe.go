package message

import (
	"fmt"
)

func (s *Bus[T]) Unsubscribe(clientId string) error {
	subscriber, ok := s.subscribers.Get(clientId)
	if !ok {
		return fmt.Errorf("client %s is not subscribed", clientId)
	}
	if subscriber == nil {
		return fmt.Errorf("subscriber for client %s is nil", clientId)
	}

	s.messageBus.Unsub(subscriber.ch, subscriber.topic)
	s.subscribers.Del(clientId)

	return nil
}
