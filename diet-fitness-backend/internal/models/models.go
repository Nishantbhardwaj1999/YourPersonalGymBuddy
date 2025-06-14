// --- diet-fitness-backend/internal/models/models.go ---
package models

import (
	"time"
)

// User represents a user in the database
type User struct {
	ID           int       `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Don't expose password hash in JSON responses
	CreatedAt    time.Time `json:"created_at"`
}

// UserRegisterPayload represents the expected payload for user registration
type UserRegisterPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// UserLoginPayload represents the expected payload for user login
type UserLoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse represents the response after successful login
type LoginResponse struct {
	Token string `json:"token"`
	Email string `json:"email"`
}

// ErrorResponse represents a generic error message for API responses
type ErrorResponse struct {
	Message string `json:"message"`
}

// DashboardData represents the placeholder data for the user dashboard
type DashboardData struct {
	Message    string `json:"message"`
	UserName   string `json:"user_name"`
	Progress   string `json:"progress"`
	LastUpdate string `json:"last_update"`
}

// FitnessPlan represents a diet or workout plan
type FitnessPlan struct {
	Type        string `json:"type"` // "Diet" or "Workout"
	Title       string `json:"title"`
	Description string `json:"description"`
}

// PlanGenerationRequest represents the request for generating a plan
type PlanGenerationRequest struct {
	UserPrompt string `json:"user_prompt"`
}
