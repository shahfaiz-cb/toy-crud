package service

import (
	"time"

	"github.com/couchbase/gocb/v2"
	"github.com/google/uuid"
	"github.com/shahfaiz-07/capella_api/internal/model"
	"github.com/shahfaiz-07/capella_api/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	cluster    *gocb.Cluster
	collection *gocb.Collection
	bucketPath string
	jwtSecret  string
}

func NewUserService(cluster *gocb.Cluster, collection *gocb.Collection, bucketPath string, jwtSecret string) *UserService {
	return &UserService{
		cluster:    cluster,
		collection: collection,
		bucketPath: bucketPath,
		jwtSecret:  jwtSecret,
	}
}

func (s *UserService) Signup(email, password, fullName string) (*model.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	currentTime := time.Now()
	newUser := &model.User{
		ID:           "user::" + uuid.New().String(),
		Type:         "user",
		Email:        email,
		PasswordHash: string(hashedPassword),
		FullName:     fullName,
		CreatedAt:    currentTime,
		UpdatedAt:    currentTime,
	}

	_, err = s.collection.Insert(newUser.ID, newUser, nil)
	if err != nil {
		return nil, err
	}

	return newUser, nil
}

func (s *UserService) CheckExistingUser(email string) error {
	user, err := s.FindUserByEmail(email)
	if err != nil {
		return err
	}
	if user != nil {
		return ErrExistingUser
	}
	return nil
}

func (s *UserService) FindUserByEmail(email string) (*model.User, error) {
	query := `
		SELECT u.*
		FROM ` + s.bucketPath + ` u
		WHERE u.type = "user" AND u.email = $email
		LIMIT 1
	`

	queryOptions := &gocb.QueryOptions{
		NamedParameters: map[string]any{
			"email": email,
		},
	}

	result, err := s.cluster.Query(query, queryOptions)
	if err != nil {
		return nil, err
	}

	defer result.Close()

	var user model.User

	if result.Next() {
		if err := result.Row(&user); err != nil {
			return nil, err
		}
		return &user, nil
	}

	return nil, nil // not found!!
}

func (s *UserService) Login(email, password string) (*jwt.JWT, error) {
	res, err := s.FindUserByEmail(email)
	if err != nil {
		return nil, ErrInternalServer
	}

	if res == nil {
		return nil, ErrUserNotFound
	}

	if err := bcrypt.CompareHashAndPassword([]byte(res.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	token, err := jwt.GenerateToken(res.ID, s.jwtSecret)
	if err != nil {
		return nil, ErrJWT
	}

	return &jwt.JWT{
		Token: token,
	}, nil
}
