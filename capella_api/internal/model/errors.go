package model

import "errors"

var (
	ErrInvalidStatus = errors.New("Invalid status")
	ErrInvalidPriority = errors.New("Invalid priority")
)