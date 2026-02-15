package main

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/shahfaiz-07/capella_api/internal/config"
	"github.com/shahfaiz-07/capella_api/internal/utils"
	"github.com/shahfaiz-07/capella_api/server"
)

func main() {
	fmt.Println("Starting the application...")

	fmt.Println("Injecting envs...")
	err := godotenv.Load(".env")
	utils.CheckNilError(err)

	cfg := config.Load()

	svr, err := server.New(cfg)
	utils.CheckNilError(err)

	err = svr.ListenAndServe()
	utils.CheckNilError(err)
}
