package sse

type EventType string

const (
	TodoCreated EventType = "created"
	TodoUpdated EventType = "updated"
	TodoDeleted EventType = "deleted"
)

type Event struct {
	Type EventType
	Message string
}