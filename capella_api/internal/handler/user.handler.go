package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/shahfaiz-07/capella_api/internal/service"
	"github.com/shahfaiz-07/capella_api/pkg/response"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{
		service: service,
	}
}

type SignupRequest struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
	FullName        string `json:"fullName"`
}

func (h *UserHandler) Register(r *mux.Router) {
	auth := r.PathPrefix("/api/v1/auth").Subrouter()

	auth.HandleFunc("/sign-up", h.Signup).Methods(http.MethodPost)
	auth.HandleFunc("/login", h.Login).Methods(http.MethodPost)
}

func (h *UserHandler) Signup(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	email := strings.TrimSpace(req.Email)
	password := strings.TrimSpace(req.Password)
	fullName := strings.TrimSpace(req.FullName)
	confirmPassword := strings.TrimSpace(req.ConfirmPassword)

	if email == "" || password == "" || fullName == "" || confirmPassword == "" {
		response.Error(w, http.StatusBadRequest, "All fields are required")
		return
	}

	if password != confirmPassword {
		response.Error(w, http.StatusBadRequest, "Password and Confirm Password does not match")
		return
	}

	err := h.service.CheckExistingUser(email)

	if err != nil {
		if errors.Is(err, service.ErrExistingUser) {
			response.Error(w, http.StatusConflict, "User already exists")
			return
		}
		fmt.Println("Error :", err)
		response.Error(w, http.StatusInternalServerError, "Error registering user")
		return
	}

	user, err := h.service.Signup(email, password, fullName)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Error registering user")
		return
	}

	user.PasswordHash = ""

	response.Success(w, http.StatusCreated, "User created successfully", user)
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	email := strings.TrimSpace(req.Email)
	password := strings.TrimSpace(req.Password)

	if email == "" || password == "" {
		response.Error(w, http.StatusBadRequest, "All fields are required")
		return
	}

	jwt, err := h.service.Login(email, password)

	if err != nil {
		switch {
		case errors.Is(err, service.ErrInternalServer):
			response.Error(w, http.StatusInternalServerError, "Internal server error")
		case errors.Is(err, service.ErrUserNotFound), errors.Is(err, service.ErrInvalidCredentials):
			response.Error(w, http.StatusUnauthorized, "Invalid credentials")
		case errors.Is(err, service.ErrJWT):
			response.Error(w, http.StatusInternalServerError, "Error authenticatin user")
		default:
			fmt.Println("Error:", err)
			response.Error(w, http.StatusInternalServerError, "Something went wrong")
		}
		return
	}

	response.Success(w, http.StatusOK, "Login Successful", jwt)
}
