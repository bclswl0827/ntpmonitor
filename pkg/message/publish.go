package message

func (s *Bus[T]) Publish(topic string, message T) {
	s.messageBus.Pub(message, topic)
}
