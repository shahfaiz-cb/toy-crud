package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/shahfaiz-07/capella_api/internal/middleware"
	"github.com/shahfaiz-07/capella_api/internal/model"
	"github.com/shahfaiz-07/capella_api/internal/service"
	"github.com/shahfaiz-07/capella_api/pkg/response"
)

type TodoHandler struct {
	service *service.TodoService
}

func NewTodoHandler(service *service.TodoService) *TodoHandler {
	return &TodoHandler{
		service: service,
	}
}

func (h *TodoHandler) Register(r *mux.Router, secret string) {
	todos := r.PathPrefix("/api/v1/todos").Subrouter()

	authMiddleware := middleware.JWTAuth(secret)
	todos.Use(authMiddleware)

	todos.HandleFunc("", h.Create).Methods(http.MethodPost)
	todos.HandleFunc("", h.Get).Methods(http.MethodGet)
	todos.HandleFunc("/t/{id}", h.GetOne).Methods(http.MethodGet)
	todos.HandleFunc("/t/{id}", h.DeleteOne).Methods(http.MethodDelete)
	todos.HandleFunc("/t/{id}", h.UpdateOne).Methods(http.MethodPut)
	todos.HandleFunc("/t/{id}/status", h.UpdateStatus).Methods(http.MethodPut)
	todos.HandleFunc("/search", h.Query).Methods(http.MethodGet)
}

type CreateRequest struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Priority    int      `json:"priority"`
	Tags        []string `json:"tags"`
}

func (h *TodoHandler) Create(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok {
		response.Error(w, http.StatusUnauthorized, "User unauthorized in handler")
		return
	}
	if userId == "" {
		response.Error(w, http.StatusUnauthorized, "Unauthorized user")
		return
	}

	var req CreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	title := strings.TrimSpace(req.Title)
	description := strings.TrimSpace(req.Description)
	tags := req.Tags
	priority := req.Priority

	if title == "" || description == "" {
		response.Error(w, http.StatusBadRequest, "Title and Description is Required")
		return
	}
	// TODO: move parse login to service
	modelPriority, err := model.ParsePriority(priority)

	if err != nil {
		if errors.Is(err, model.ErrInvalidPriority) {
			response.Error(w, http.StatusBadRequest, "Invalid priority")
			return
		}
		response.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	todo, err := h.service.CreateTodo(userId, title, description, modelPriority, tags)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Error creating todo")
		return
	}

	response.Success(w, http.StatusCreated, "Todo created successfully", todo)
}

func (h *TodoHandler) Get(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok {
		response.Error(w, http.StatusUnauthorized, "User unauthorized in handler")
		return
	}
	if userId == "" {
		response.Error(w, http.StatusUnauthorized, "Unauthorized user")
		return
	}

	todos, err := h.service.FetchUserTodos(userId)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Error fetching user todos")
		return
	}

	response.Success(w, http.StatusOK, "Todos fetch successfully", todos)
}

func (h *TodoHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok {
		response.Error(w, http.StatusUnauthorized, "User unauthorized in handler")
		return
	}
	if userId == "" {
		response.Error(w, http.StatusUnauthorized, "Unauthorized user")
		return
	}

	params := mux.Vars(r)
	todoId := params["id"]

	if todoId == "" {
		response.Error(w, http.StatusBadRequest, "Todo id is required")
		return
	}

	todo, err := h.service.FetchUserTodo(userId, todoId)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Error fetching user todos")
		return
	}

	if todo == nil {
		response.Error(w, http.StatusNotFound, "Todo not found")
		return
	}

	response.Success(w, http.StatusOK, "Todo fetch successfully", todo)
}

func (h *TodoHandler) DeleteOne(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok {
		response.Error(w, http.StatusUnauthorized, "User unauthorized in handler")
		return
	}
	if userId == "" {
		response.Error(w, http.StatusUnauthorized, "Unauthorized user")
		return
	}

	params := mux.Vars(r)
	todoId := params["id"]

	if todoId == "" {
		response.Error(w, http.StatusBadRequest, "Todo id is required")
		return
	}

	todo, err := h.service.DeleteTodo(userId, todoId)

	if err != nil {
		switch {
		case errors.Is(err, service.ErrTodoNotFound), errors.Is(err, service.ErrUserUnauthorized):
			response.Error(w, http.StatusNotFound, "Todo not found")
			return
		}
		response.Error(w, http.StatusInternalServerError, "Error deleting todo")
		return
	}

	response.Success(w, http.StatusOK, "Todo deleted successfully", todo)
}

type UpdateOneRequest struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Priority    int      `json:"priority"`
	Tags        []string `json:"tags"`
}

// TODO: cannot update a completed task
func (h *TodoHandler) UpdateOne(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok {
		response.Error(w, http.StatusUnauthorized, "User unauthorized in handler")
		return
	}
	if userId == "" {
		response.Error(w, http.StatusUnauthorized, "Unauthorized user")
		return
	}

	params := mux.Vars(r)
	todoId := params["id"]

	if todoId == "" {
		response.Error(w, http.StatusBadRequest, "Todo id is required")
		return
	}

	var req UpdateOneRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	title := strings.TrimSpace(req.Title)
	description := strings.TrimSpace(req.Description)
	tags := req.Tags
	priority := req.Priority

	if title == "" || description == "" {
		response.Error(w, http.StatusBadRequest, "Title and Description is Required")
		return
	}

	// TODO: move parse login to service
	modelPriority, err := model.ParsePriority(priority)

	if err != nil {
		if errors.Is(err, model.ErrInvalidPriority) {
			response.Error(w, http.StatusBadRequest, "Invalid priority")
			return
		}
		response.Error(w, http.StatusInternalServerError, "Internal server error")
	}

	todo, err := h.service.UpdateTodo(userId, todoId, title, description, modelPriority, tags)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrTodoNotFound), errors.Is(err, service.ErrUserUnauthorized):
			response.Error(w, http.StatusNotFound, "Todo not found")
			return
		}
		response.Error(w, http.StatusInternalServerError, "Error updating todo")
		return
	}

	response.Success(w, http.StatusOK, "Todo updated successfully", todo)
}

type UpdateStatusRequest struct {
	Status string `json:"status"`
}

func (h *TodoHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok {
		response.Error(w, http.StatusUnauthorized, "User unauthorized in handler")
		return
	}
	if userId == "" {
		response.Error(w, http.StatusUnauthorized, "Unauthorized user")
		return
	}

	params := mux.Vars(r)
	todoId := params["id"]

	var req UpdateStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	status := req.Status

	if status == "" {
		response.Error(w, http.StatusBadRequest, "Status field is required")
		return
	}

	todo, err := h.service.UpdateStatus(userId, todoId, status)
	if err != nil {
		switch {
		case errors.Is(err, model.ErrInvalidStatus):
			response.Error(w, http.StatusBadRequest, "Invalid status")
			return
		case errors.Is(err, service.ErrTodoNotFound), errors.Is(err, service.ErrUserUnauthorized):
			response.Error(w, http.StatusNotFound, "Todo not found")
			return
		}
		response.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response.Success(w, http.StatusOK, "Status updated successfully", todo)
}

func (h *TodoHandler) Query(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok {
		response.Error(w, http.StatusUnauthorized, "User unauthorized in handler")
		return
	}
	if userId == "" {
		response.Error(w, http.StatusUnauthorized, "Unauthorized user")
		return
	}

	query := r.URL.Query().Get("query")

	if query == "" {
		h.Get(w, r)
		return
	}

	todos, err := h.service.FetchQuery(userId, query)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrFetchTodos):
			response.Error(w, http.StatusInternalServerError, "Error fetching todos")
			return
		}
		response.Error(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response.Success(w, http.StatusOK, "Todos fetched successfully", todos) 
}