package server

import (
	"fmt"
	"net/http"

	"github.com/couchbase/gocb/v2"
	"github.com/shahfaiz-07/capella_api/internal/config"
	"github.com/shahfaiz-07/capella_api/internal/db"
	"github.com/shahfaiz-07/capella_api/internal/handler"
	"github.com/shahfaiz-07/capella_api/internal/middleware"
	"github.com/shahfaiz-07/capella_api/internal/router"
	"github.com/shahfaiz-07/capella_api/internal/service"
	"github.com/shahfaiz-07/capella_api/internal/sse"
)

type Server struct {
	httpServer *http.Server
}

func New(cfg *config.Config) (*Server, error) {
	cluster, collection, err := db.ConnectDB(cfg)
	if err != nil {
		return nil, err
	}

	broker := sse.New()
	broker.Run()

	bucketPath := fmt.Sprintf("`%s`.`%s`.`%s`", cfg.CPBucketName, cfg.CPScopeName, cfg.CPCollection)

	// err = ensureIndexes(cluster, bucketPath)
	// if err != nil {
	// 	return nil, err
	// }
	// fmt.Println("Index Created ✅")

	userServices := service.NewUserService(cluster, collection, bucketPath, cfg.JWTSecret)
	userHandlers := handler.NewUserHandler(userServices)
	
	todoServices := service.NewTodoService(cluster, collection, broker, bucketPath)
	todoHandlers := handler.NewTodoHandler(todoServices)

	sseHandlers := handler.NewSSEHandler(broker)

	r := router.Router()

	r.Use(middleware.CrossOrigin(cfg.AllowedOrigin))

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Serving data correctly"))
	})

	userHandlers.Register(r)
	todoHandlers.Register(r, cfg.JWTSecret)
	sseHandlers.Register(r, cfg.JWTSecret)

	s := &Server{
		httpServer: &http.Server{
			Addr:    ":8080",
			Handler: r,
		},
	}

	return s, nil
}

func ensureIndexes(cluster *gocb.Cluster, bucketPath string) error {
    fmt.Println("Creating indexes...")
    
    indexes := []string{
        // User email index
        `CREATE INDEX IF NOT EXISTS idx_user_email
        ON ` + bucketPath + `(email)
        WHERE type = "user"`,
        
        // the Todo ID and user index
        `CREATE INDEX IF NOT EXISTS idx_todo_id_user
        ON ` + bucketPath + `(id, userId)
        WHERE type = "todo"`,
        
        // Search index
        `CREATE INDEX IF NOT EXISTS idx_todo_search
        ON ` + bucketPath + `(userId, LOWER(title), LOWER(description))
        WHERE type = "todo"`,
    }
    
    for _, indexQuery := range indexes {
        _, err := cluster.Query(indexQuery, nil)
        if err != nil {
            return fmt.Errorf("failed to create index: %w", err)
        }
    }
    
    return nil
}

func (s *Server) ListenAndServe() error {
	fmt.Printf("Listening on: %v\n", s.httpServer.Addr)
	return s.httpServer.ListenAndServe()
}
