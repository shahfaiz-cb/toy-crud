package service

import "errors"

var (
	ErrInvalidCredentials = errors.New("Invalid Credentials")
	ErrUserNotFound = errors.New("User not found")
	ErrInternalServer = errors.New("Internal server error")
	ErrJWT = errors.New("Error generating JWT")
	ErrExistingUser = errors.New("User already exists")
	ErrFetchTodos = errors.New("Error fetching todos")
	ErrTodoNotFound = errors.New("Todo not found")
	ErrUserUnauthorized = errors.New("User not allowed to delete this todo")
)