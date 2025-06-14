// --- diet-fitness-backend/internal/db/sqlite.go ---
package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath" // Import for creating parent directories

	"diet-fitness-backend/config" // Import your config package

	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

// InitDB initializes and returns an SQLite database connection
func InitDB(cfg *config.Config) (*sql.DB, error) {
	// Ensure the directory for the DB file exists
	dbDir := filepath.Dir(cfg.SQLiteDBPath)
	if err := os.MkdirAll(dbDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create database directory %s: %w", dbDir, err)
	}

	db, err := sql.Open("sqlite3", cfg.SQLiteDBPath)
	if err != nil {
		return nil, fmt.Errorf("error opening SQLite database: %w", err)
	}

	// Ping the database to verify connection
	if err = db.Ping(); err != nil {
		db.Close() // Close the connection if ping fails
		return nil, fmt.Errorf("error connecting to the SQLite database: %w", err)
	}

	log.Println("SQLite database connection established successfully.")

	// Initialize schema (create tables if they don't exist)
	if err := createSchema(db); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to create SQLite schema: %w", err)
	}
	log.Println("SQLite schema created/verified.")

	return db, nil
}

// createSchema creates the necessary tables if they don't exist
func createSchema(db *sql.DB) error {
	usersTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := db.Exec(usersTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create users table: %w", err)
	}
	return nil
}
