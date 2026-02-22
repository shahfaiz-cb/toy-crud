package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/couchbase/gocb/v2"
	"github.com/google/uuid"
	"github.com/shahfaiz-07/capella_api/internal/model"
	"github.com/shahfaiz-07/capella_api/internal/sse"
)

type TodoService struct {
	cluster    *gocb.Cluster
	collection *gocb.Collection
	broker *sse.Broker
	bucketPath string
}

func NewTodoService(cluster *gocb.Cluster, collection *gocb.Collection, broker *sse.Broker, bucketPath string) *TodoService {
	return &TodoService{
		cluster:    cluster,
		collection: collection,
		broker: broker,
		bucketPath: bucketPath,
	}
}

func (s *TodoService) CreateTodo(userId, title, description string, priority model.Priority, tags []string) (*model.Todo, error) {
	currentTime := time.Now()

	newTodo := &model.Todo{
		ID:          "todo::" + uuid.New().String(),
		Type:        "todo",
		UserID:      userId,
		Title:       title,
		Description: description,
		Status:      model.StatusPending,
		Tags:        tags,
		CreatedAt:   currentTime,
		UpdatedAt:   currentTime,
		Priority:    priority,
	}

	_, err := s.collection.Insert(newTodo.ID, newTodo, nil)
	if err != nil {
		return nil, err
	}

	msg := sse.Event{
		Type: sse.TodoCreated,
		Message: newTodo.ID,
	}

	message, err := json.Marshal(msg)
	if err != nil {
		fmt.Println("Failed to marshal sse event:", err)
	} else {
		s.broker.Publish(userId, message)
	}

	return newTodo, nil
}

func (s *TodoService) FetchUserTodos(userId string) ([]*model.Todo, error) {
	query := `
		SELECT t.*
		FROM ` + s.bucketPath + ` t
		WHERE t.type = "todo" AND t.userId = $userId
		ORDER BY t.createdAt DESC
	`

	queryOptions := &gocb.QueryOptions{
		NamedParameters: map[string]any{
			"userId": userId,
		},
	}

	result, err := s.cluster.Query(query, queryOptions)
	if err != nil {
		return nil, ErrFetchTodos
	}
	defer result.Close()

	todos := []*model.Todo{}

	for result.Next() {
		var todo model.Todo
		if err := result.Row(&todo); err != nil {
			return nil, err
		}
		todos = append(todos, &todo)
	}

	if err := result.Err(); err != nil {
		return nil, ErrFetchTodos
	}

	return todos, nil
}

func (s *TodoService) FetchUserTodo(userId, todoId string) (*model.Todo, error) {
	query := `
		SELECT t.*
		FROM ` + s.bucketPath + ` t
		WHERE t.type = "todo" AND t.userId = $userId AND t.id = $todoId
		LIMIT 1
	`

	queryOptions := &gocb.QueryOptions{
		NamedParameters: map[string]any{
			"userId": userId,
			"todoId": todoId,
		},
	}

	result, err := s.cluster.Query(query, queryOptions)
	if err != nil {
		return nil, err
	}
	defer result.Close()

	var todo model.Todo

	if result.Next() {
		if err := result.Row(&todo); err != nil {
			return nil, err
		}
		return &todo, nil
	}

	return nil, nil
}

func (s *TodoService) DeleteTodo(userId, todoId string) (*model.Todo, error) {
	// we can use query or the .Remove function
	// while using .Remove we will have to first verify that the given todo belongs to the specified user or not

	result, err := s.collection.Get(todoId, nil)

	if err != nil {
		if errors.Is(err, gocb.ErrDocumentNotFound) {
			return nil, ErrTodoNotFound
		}
		return nil, err
	}

	var todo model.Todo

	err = result.Content(&todo)
	if err != nil {
		return nil, err
	}

	// if the todo belongs to user
	if todo.UserID == userId {
		// remove the todo
		_, err := s.collection.Remove(todoId, nil)
		if err != nil {
			return nil, err
		}

		msg := sse.Event{
			Type: sse.TodoDeleted,
			Message: todo.ID,
		}

		message, err := json.Marshal(msg)
		if err != nil {
			fmt.Println("Failed to marshal sse event:", err)
		} else {
			s.broker.Publish(userId, message)
		}

		return &todo, nil
	}
	// the todo does not belong to user
	return nil, ErrUserUnauthorized
}

func (s *TodoService) UpdateTodo(userId, todoId, title, description string, priority model.Priority, tags []string) (*model.Todo, error) {
	// we can use query or .Replace, .Upsert

	result, err := s.collection.Get(todoId, nil)

	if err != nil {
		if errors.Is(err, gocb.ErrDocumentNotFound) {
			return nil, ErrTodoNotFound
		}
		return nil, err
	}

	var todo model.Todo

	err = result.Content(&todo)
	if err != nil {
		return nil, err
	}

	// if the todo belongs to user
	if todo.UserID == userId {
		// replace the todo
		todo.Title = title
		todo.Description = description
		todo.Priority = priority
		todo.Tags = tags

		// update the updatedAt field
		todo.UpdatedAt = time.Now()

		_, err := s.collection.Replace(todoId, todo, nil)
		if err != nil {
			return nil, err
		}

		msg := sse.Event{
			Type: sse.TodoUpdated,
			Message: todo.ID,
		}

		message, err := json.Marshal(msg)
		if err != nil {
			fmt.Println("Failed to marshal sse event:", err)
		} else {
			s.broker.Publish(userId, message)
		}

		return &todo, nil
	}
	// the todo does not belong to user
	return nil, ErrUserUnauthorized
}

// TODO: rather than fetching the whole document fetch the userId only
// TODO: use mutate instead of replace

// mark as done = MutateIn()
func (s *TodoService) UpdateStatus(userId, todoId, status string) (*model.Todo, error) {
	modelStatus, err := model.ParseStatus(status)
	if err != nil {
		return nil, err
	}

	result, err := s.collection.Get(todoId, nil)
	if err != nil {
		if errors.Is(err, gocb.ErrDocumentNotFound) {
			return nil, ErrTodoNotFound
		}
		return nil, err
	}

	var todo model.Todo
	err = result.Content(&todo)

	if err != nil {
		return nil, err
	}
	// TODO: no need to fetch the whole document here
	if todo.UserID == userId {
		// the todo belongs to user
		currTime := time.Now()

		specs := []gocb.MutateInSpec{
			gocb.ReplaceSpec("status", modelStatus, nil),
			gocb.ReplaceSpec("updatedAt", currTime, nil),
		}
		switch modelStatus {
		case model.StatusInProgress, model.StatusPending:
			// TODO: will this throw an error if completedAt is already absent?
			specs = append(specs, gocb.UpsertSpec("completedAt", nil, nil))
		case model.StatusCompleted:
			specs = append(specs, gocb.UpsertSpec("completedAt", &currTime, nil))
		default:
			return nil, ErrInternalServer
		}

		_, err = s.collection.MutateIn(todoId, specs, nil)
		if err != nil {
			return nil, err
		}

		// TODO: Additional fetch??
		result, err = s.collection.Get(todoId, nil)
		if err != nil {
			return nil, err
		}

		err = result.Content(&todo)
		if err != nil {
			return nil, err
		}

		msg := sse.Event{
			Type: sse.TodoUpdated,
			Message: todo.ID,
		}

		message, err := json.Marshal(msg)
		if err != nil {
			fmt.Println("Failed to marshal sse event:", err)
		} else {
			s.broker.Publish(userId, message)
		}

		return &todo, nil
	}

	return nil, ErrUserUnauthorized
}

func (s *TodoService) FetchQuery(userId, queryString string) ([]*model.Todo, error) {
	query := `
		SELECT t.*
		FROM ` + s.bucketPath + ` t
		WHERE t.type="todo" AND t.userId = $userId
			AND (LOWER(t.title) LIKE $searchString OR LOWER(t.description) LIKE $searchString)
			ORDER BY t.createdAt DESC
	`

	searchString := "%" + strings.ToLower(queryString) + "%"

	queryOptions := &gocb.QueryOptions{
		NamedParameters: map[string]any{
			"userId": userId,
			"searchString": searchString,
		},
	}

	result, err := s.cluster.Query(query, queryOptions)
	if err != nil {
		return nil, ErrFetchTodos
	}
	defer result.Close()

	var todos []*model.Todo
	for result.Next() {
		var todo model.Todo
		if err := result.Row(&todo); err != nil {
			return nil, err
		}
		todos = append(todos, &todo)
	}

	if err := result.Err(); err != nil {
		return nil, err
	}

	return todos, nil
}