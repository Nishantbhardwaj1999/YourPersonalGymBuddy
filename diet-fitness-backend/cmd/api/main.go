// --- diet-fitness-backend/cmd/api/main.go ---
package main

import (
	"fmt"
	"log"
	"net/http"
	"os" // Added for os.MkdirAll
	"time"

	"diet-fitness-backend/config"
	"diet-fitness-backend/internal/db" // Will now import sqlite.go functions
	"diet-fitness-backend/routes"

	"github.com/gorilla/mux"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading configuration: %v", err)
	}

	// Initialize database connection (now uses SQLite)
	database, err := db.InitDB(cfg) // This calls InitDB from internal/db/sqlite.go
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer database.Close()
	// Success message is handled within db.InitDB

	// Create uploads directory if it doesn't exist
	if err := os.MkdirAll(cfg.UploadDir, 0755); err != nil {
		log.Fatalf("Failed to create upload directory: %v", err)
	}
	fmt.Printf("Upload directory created/verified at: %s\n", cfg.UploadDir)

	// Initialize router
	r := mux.NewRouter()

	// Register API routes
	routes.RegisterAPIRoutes(r, database, cfg) // Pass db and cfg to routes

	// Set up HTTP server
	srv := &http.Server{
		Handler: r,
		Addr:    fmt.Sprintf(":%s", cfg.ServerPort),
		// Good practice: Set timeouts to avoid Slowloris attacks and keepalives
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	fmt.Printf("Server starting on port %s...\n", cfg.ServerPort)
	log.Fatal(srv.ListenAndServe())
}
