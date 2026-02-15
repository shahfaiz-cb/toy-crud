package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/shahfaiz-07/capella_api/pkg/jwt"
	"github.com/shahfaiz-07/capella_api/pkg/response"
)

type contextKey string
const UserContextKey contextKey = "userId"

func JWTAuth(secret string) func(http.Handler) http.Handler {
	return func (next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				response.Error(w, http.StatusUnauthorized, "Missing auth header, login required!")
				return
			}
	
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				response.Error(w, http.StatusUnauthorized, "Invalid auth header format")
				return
			}
	
			tokenString := parts[1]
	
			claims, err := jwt.ValidateToken(tokenString, secret)
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "Invalid or expired token")
				return
			}

			ctx := context.WithValue(r.Context(), UserContextKey, claims.UserID)
			// In nodejs we pass on this userId in the request object itself, like req.userId = userId
			// In go we can't modify the request struct so we use context instead 

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}