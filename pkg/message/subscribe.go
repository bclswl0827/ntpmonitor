package message

import (
	"fmt"
)

func (s *Bus[T]) Subscribe(topic, clientId string, callback Callback[T]) error {
	if _, ok := s.subscribers.Get(clientId); ok {
		return fmt.Errorf("client %s is already subscribed", clientId)
	}

	ch := s.messageBus.Sub(topic)
	go func() {
		for msg := range ch {
			callback(msg)
		}
	}()

	s.subscribers.Set(clientId, &Subscriber[T]{
		topic: topic,
		ch:    ch,
	})
	return nil
}
