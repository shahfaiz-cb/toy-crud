package config

import "os"

type Config struct {
	CPConnectionString string
	CPUsername         string
	CPPassword         string
	CPBucketName       string
	CPScopeName        string
	CPCollection       string
	JWTSecret          string
	AllowedOrigin	   string
}

func Load() *Config {
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")

	if allowedOrigin == "" {
		allowedOrigin = "*"
	}

	return &Config{
		CPConnectionString: os.Getenv("CP_CONNECTION_STRING"),
		CPUsername:         os.Getenv("CP_USERNAME"),
		CPPassword:         os.Getenv("CP_PASSWORD"),
		CPBucketName:       os.Getenv("CP_BUCKET_NAME"),
		CPScopeName:        os.Getenv("CP_SCOPE_NAME"),
		CPCollection:       os.Getenv("CP_COLLECTION_NAME"),
		JWTSecret:          os.Getenv("JWT_SECRET"),
		AllowedOrigin:      allowedOrigin,
	}
}
