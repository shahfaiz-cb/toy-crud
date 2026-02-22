package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/shahfaiz-07/capella_api/internal/middleware"
	"github.com/shahfaiz-07/capella_api/internal/sse"
	"github.com/shahfaiz-07/capella_api/pkg/response"
)

const (
	pingDuration = time.Second * 10
)

type SSEHandler struct {
	broker *sse.Broker
}

func NewSSEHandler(broker *sse.Broker) *SSEHandler {
	return &SSEHandler{
		broker: broker,
	}
}

func (h *SSEHandler) Register(r *mux.Router, secret string) {
	notif := r.PathPrefix("/api/v1/notifications").Subrouter()

	notif.Methods(http.MethodOptions).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	authMiddleware := middleware.JWTAuth(secret)
	notif.Use(authMiddleware)

	notif.HandleFunc("/stream", h.Notifications).Methods(http.MethodGet)
}

func (h *SSEHandler) Notifications(w http.ResponseWriter, r *http.Request) {
	
	flusher, ok := w.(http.Flusher)
	if !ok {
		response.Error(w, http.StatusInternalServerError, "Streaming unsupported, can't implement flusher")
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	// flush the headers immediately
	w.WriteHeader(http.StatusOK)
	flusher.Flush()

	// creating channel for this connection
	messages := make(chan []byte, 1)
	userId, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok {
		response.Error(w, http.StatusUnauthorized, "User unauthorized in handler")
		return
	}
	if userId == "" {
		response.Error(w, http.StatusUnauthorized, "Unauthorized user")
		return
	}

	// a channel to manage client disconnect, when the client disconnects a message is passed here
	clientGone := r.Context().Done()

	// heartbeat to keep the connection alive
	heartbeat := time.NewTicker(pingDuration)
	defer heartbeat.Stop()

	// create a new identifier for this client
	id := uuid.New().String()
	// register this client with broker
	h.broker.NewClient(id, userId, messages)
	// remember to close after the client is disconnected
	defer h.broker.CloseClient(id, userId)
	fmt.Printf("Client %s connected for userId %s\n", id, userId)

	for {
		select {
		// client disconnect
		case <-clientGone:
			fmt.Println("Client disconnected!")
			return
		// heartbeat
		case <-heartbeat.C: // the channel in which ticks are delivered
			if _, err := fmt.Fprint(w, ":heartbeat\n\n"); err != nil {
				fmt.Println("Unable to send heartbeat...")
			}
			flusher.Flush()
		// notification received
		case msg := <-messages:
			var notif sse.Event
			if err := json.Unmarshal(msg, &notif); err != nil {
				fmt.Println("Error unmarshalling event...")
				break
			}

			if notif.Message == "" || notif.Type == "" {
				continue
			}

			//! here instead of unmarshalling the event we can send it directly in data:, but that means no named events, which means frontend will listen directly on onmessage handler and manually check if event.Data.type === "created", then do this
			if _, err := fmt.Fprintf(w, "event: %s\ndata: %s\n\n", notif.Type, notif.Message); err != nil {
				fmt.Println("Unable to write data to response writer...")
			}
			flusher.Flush()
		}
	}
}
