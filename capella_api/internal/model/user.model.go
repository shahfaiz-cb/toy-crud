package model

import "time"

type User struct {
	Type         string    `json:"type"`
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"passwordHash"`
	FullName     string    `json:"fullName"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
