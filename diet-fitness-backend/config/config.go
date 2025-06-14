// --- diet-fitness-backend/config/config.go ---
package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all application configurations
type Config struct {
	SQLiteDBPath string // Path to your SQLite database file
	JWTSecret    string
	ServerPort   string
	UploadDir    string
}

// LoadConfig reads configuration from .env file or environment variables
func LoadConfig() (*Config, error) {
	// Load .env file. If it doesn't exist, it's fine (e.g., in production where env vars are set directly)
	err := godotenv.Load()
	if err != nil && !os.IsNotExist(err) {
		fmt.Printf("Warning: Could not load .env file: %v. Relying on environment variables.\n", err)
	}

	cfg := &Config{
		SQLiteDBPath: getEnv("SQLITE_DB_PATH", "./data/fitplan.db"),                          // Default SQLite path
		JWTSecret:    getEnv("JWT_SECRET", "default-jwt-secret-please-change-in-production"), // Fallback for dev
		ServerPort:   getEnv("SERVER_PORT", "8080"),
		UploadDir:    getEnv("UPLOAD_DIR", "./uploads"),
	}

	// Basic validation for critical config
	if cfg.JWTSecret == "default-jwt-secret-please-change-in-production" {
		fmt.Println("WARNING: JWT_SECRET is using a default value. Please set a strong secret in your .env file or environment variables for security.")
	}

	return cfg, nil
}

// Helper function to get environment variable or fallback to a default
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
