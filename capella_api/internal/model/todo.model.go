package model

import "time"

type Status string

const (
	StatusPending   Status = "pending"
	StatusInProgress Status = "in_progress"
	StatusCompleted Status = "completed"
)

func ParseStatus(s string) (Status, error) {
	status := Status(s)
	switch status {
	case StatusCompleted, StatusPending, StatusInProgress:
		return status, nil
	}
	return "", ErrInvalidStatus
}

type Priority int

const (
	PriorityLow Priority = iota
	PriorityMedium
	PriorityHigh
	PriorityUrgent
)

func ParsePriority(p int) (Priority, error) {
	priority := Priority(p)
	switch priority {
	case PriorityLow, PriorityMedium, PriorityHigh, PriorityUrgent:
		return priority, nil
	}
	return 0, ErrInvalidPriority
}

type Todo struct {
	Type        string     `json:"type"`
	ID          string     `json:"id"`
	UserID      string     `json:"userId"` // this will ref to the id of the User
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      Status     `json:"status"`
	Priority    Priority   `json:"priority"`
	Tags        []string   `json:"tags"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`
	// we are using a pointer here because time.Time has a zero value of '0001-01-01T00:00:00Z', when the todo is not complete, you cannot distinguish between "not set" and "actually zero time"
	// pointers can be nil, hence the omitempty tag will exclude it compelely from the json
}
