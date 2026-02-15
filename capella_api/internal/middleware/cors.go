package middleware

import "net/http"

const (
	AllowedHeaders = "Content-Type, Authorization"

	AccessControlAllowHeaders = "Access-Control-Allow-Headers"

	AccessControlAllowMethods = "Access-Control-Allow-Methods"

	AccessControlAllowOrigin = "Access-Control-Allow-Origin"

)

func CrossOrigin(allowedOrigin string) func(http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			accept(allowedOrigin, w)
			
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			h.ServeHTTP(w, r)
		})
	}
}

func accept(origin string, w http.ResponseWriter) {
	w.Header().Set(AccessControlAllowHeaders, AllowedHeaders)
	w.Header().Set(AccessControlAllowMethods, "OPTIONS, POST, PUT, GET, DELETE")
	w.Header().Set(AccessControlAllowOrigin, "*")
}
