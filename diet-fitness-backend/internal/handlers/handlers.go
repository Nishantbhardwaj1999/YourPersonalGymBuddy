// --- diet-fitness-backend/internal/handlers/handlers.go ---
package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings" // Added for SQLite unique constraint error check
	"time"

	"diet-fitness-backend/config"
	"diet-fitness-backend/internal/auth"
	"diet-fitness-backend/internal/models"

	"golang.org/x/crypto/bcrypt"
)

// Helper function for JSON response
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		http.Error(w, `{"message": "Error marshalling JSON response"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

// RegisterUser handles new user registration
func RegisterUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload models.UserRegisterPayload
		err := json.NewDecoder(r.Body).Decode(&payload)
		if err != nil {
			respondWithJSON(w, http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request payload"})
			return
		}

		if payload.Email == "" || payload.Password == "" {
			respondWithJSON(w, http.StatusBadRequest, models.ErrorResponse{Message: "Email and password are required"})
			return
		}

		// Hash the password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
		if err != nil {
			respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "Error hashing password"})
			return
		}

		// Insert user into database
		var userID int
		// SQLite uses ? for placeholders, and RETURNING id is supported.
		err = db.QueryRow("INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING id",
			payload.Email, string(hashedPassword)).Scan(&userID)
		if err != nil {
			// Check for unique constraint violation specifically for SQLite
			if strings.Contains(err.Error(), "UNIQUE constraint failed") {
				respondWithJSON(w, http.StatusConflict, models.ErrorResponse{Message: "User with this email already exists"})
				return
			}
			log.Printf("Error inserting user: %v", err)
			respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "Error registering user"})
			return
		}

		respondWithJSON(w, http.StatusCreated, map[string]string{"message": "User registered successfully", "user_id": fmt.Sprintf("%d", userID)})
	}
}

// LoginUser handles user login and JWT generation
func LoginUser(db *sql.DB, cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload models.UserLoginPayload
		err := json.NewDecoder(r.Body).Decode(&payload)
		if err != nil {
			respondWithJSON(w, http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request payload"})
			return
		}

		if payload.Email == "" || payload.Password == "" {
			respondWithJSON(w, http.StatusBadRequest, models.ErrorResponse{Message: "Email and password are required"})
			return
		}

		// Retrieve user from database
		var user models.User
		var passwordHash string
		err = db.QueryRow("SELECT id, email, password_hash FROM users WHERE email = ?", payload.Email).Scan(&user.ID, &user.Email, &passwordHash)
		if err != nil {
			if err == sql.ErrNoRows {
				respondWithJSON(w, http.StatusUnauthorized, models.ErrorResponse{Message: "Invalid credentials"})
				return
			}
			log.Printf("Error retrieving user: %v", err)
			respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "Server error during login"})
			return
		}

		// Compare password hash
		err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(payload.Password))
		if err != nil {
			respondWithJSON(w, http.StatusUnauthorized, models.ErrorResponse{Message: "Invalid credentials"})
			return
		}

		// Generate JWT token
		token, err := auth.GenerateJWT(user.ID, user.Email, cfg.JWTSecret)
		if err != nil {
			log.Printf("Error generating JWT: %v", err)
			respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "Error generating token"})
			return
		}

		respondWithJSON(w, http.StatusOK, models.LoginResponse{Token: token, Email: user.Email})
	}
}

// GetDashboardData provides mock dashboard data
func GetDashboardData(w http.ResponseWriter, r *http.Request) {
	// Access user ID from context (set by JWTMiddleware)
	userID, ok := auth.GetUserIDFromContext(r)
	if !ok {
		// This should ideally not happen if middleware is working correctly
		respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "User ID not found in context"})
		return
	}
	userEmail, _ := auth.GetUserEmailFromContext(r) // Get email for personalization

	log.Printf("User %d (%s) requested dashboard data.", userID, userEmail) // Log usage of userID and userEmail

	data := models.DashboardData{
		Message:    fmt.Sprintf("Welcome back, %s! Here's your personalized fitness overview.", userEmail),
		UserName:   userEmail,
		Progress:   "You've achieved 10% of your weight loss goal and improved endurance by 15%.",
		LastUpdate: time.Now().Format("Jan 02, 2006 15:04:05 MST"),
	}
	respondWithJSON(w, http.StatusOK, data)
}

// UploadImage handles image uploads
func UploadImage(uploadDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := auth.GetUserIDFromContext(r)
		if !ok {
			respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "User ID not found in context"})
			return
		}

		// Parse multipart form (max 10MB file size)
		err := r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			respondWithJSON(w, http.StatusBadRequest, models.ErrorResponse{Message: "File upload error: " + err.Error()})
			return
		}

		file, handler, err := r.FormFile("image") // "image" is the key from your frontend form data
		if err != nil {
			respondWithJSON(w, http.StatusBadRequest, models.ErrorResponse{Message: "Error retrieving file from form: " + err.Error()})
			return
		}
		defer file.Close()

		// Create a unique filename based on user ID and timestamp
		filename := fmt.Sprintf("user_%d_%d%s", userID, time.Now().UnixNano(), filepath.Ext(handler.Filename))
		filePath := filepath.Join(uploadDir, filename)

		// Create the file on the server
		dst, err := os.Create(filePath)
		if err != nil {
			log.Printf("Error creating file on server: %v", err)
			respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "Error saving file"})
			return
		}
		defer dst.Close()

		// Copy the uploaded file data to the new file
		if _, err := io.Copy(dst, file); err != nil {
			log.Printf("Error copying file data: %v", err)
			respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "Error saving file"})
			return
		}

		// In a real app, you'd store metadata (user_id, file_path, upload_time) in the DB
		log.Printf("User %d uploaded image: %s", userID, filename)
		respondWithJSON(w, http.StatusOK, map[string]string{"message": "Image uploaded successfully", "filename": filename})
	}
}

// GenerateFitnessPlan provides a mock AI-generated plan
func GenerateFitnessPlan(w http.ResponseWriter, r *http.Request) {
	// In a real application, you'd integrate with an AI model here.
	// For example:
	// 1. Read user prompt from request body
	// 2. Call an external AI API (e.g., Gemini, OpenAI)
	// 3. Process AI response to format it as FitnessPlan
	// 4. Optionally save the plan to the database for the user

	userID, ok := auth.GetUserIDFromContext(r)
	if !ok {
		respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "User ID not found in context"})
		return
	}

	var req models.PlanGenerationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithJSON(w, http.StatusBadRequest, models.ErrorResponse{Message: "Invalid request for plan generation"})
		return
	}

	log.Printf("User %d requested plan with prompt: %s", userID, req.UserPrompt)

	// Mock AI response
	mockDietPlan := models.FitnessPlan{
		Type:        "Diet",
		Title:       "Personalized AI Diet Plan",
		Description: fmt.Sprintf("Based on your goals '%s', your AI-powered diet plan focuses on balanced nutrition. Include 1800-2000 calories, high protein, complex carbs, and healthy fats. Emphasize lean meats, vegetables, fruits, and whole grains. Drink at least 3 liters of water daily.", req.UserPrompt),
	}
	mockWorkoutPlan := models.FitnessPlan{
		Type:        "Workout",
		Title:       "Personalized AI Workout Routine",
		Description: fmt.Sprintf("Considering your request '%s', your AI-driven workout plan includes 3 days of strength training (full body) and 2 days of cardio (HIIT or steady-state). Ensure proper warm-up and cool-down. Include warm-up and cool-down stretches.", req.UserPrompt),
	}

	respondWithJSON(w, http.StatusOK, map[string][]models.FitnessPlan{
		"plans": {mockDietPlan, mockWorkoutPlan},
	})
}

// GetFitnessPlan retrieves mock fitness plan data
func GetFitnessPlan(w http.ResponseWriter, r *http.Request) {
	// In a real app, you'd fetch the user's saved plan from the database.
	// For now, return a generic mock plan or the one generated by GenerateFitnessPlan
	userID, ok := auth.GetUserIDFromContext(r)
	if !ok {
		respondWithJSON(w, http.StatusInternalServerError, models.ErrorResponse{Message: "User ID not found in context"})
		return
	}

	// This is a placeholder; ideally, fetch from DB
	genericDietPlan := models.FitnessPlan{
		Type:        "Diet",
		Title:       "Your Current Diet Plan",
		Description: "Continue with your balanced diet of lean proteins, fresh vegetables, and whole grains. Remember portion control and adequate hydration.",
	}
	genericWorkoutPlan := models.FitnessPlan{
		Type:        "Workout",
		Title:       "Your Current Workout Plan",
		Description: "Maintain your 4-day-a-week workout schedule, alternating between upper body and lower body strength training, with active recovery on rest days.",
	}

	log.Printf("User %d requested current plan.", userID)
	respondWithJSON(w, http.StatusOK, map[string][]models.FitnessPlan{
		"plans": {genericDietPlan, genericWorkoutPlan},
	})
}
