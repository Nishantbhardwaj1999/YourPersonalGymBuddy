// --- diet-fitness-backend/routes/routes.go ---
package routes

import (
	"database/sql"
	"net/http"

	"diet-fitness-backend/config"
	"diet-fitness-backend/internal/auth"
	"diet-fitness-backend/internal/handlers"
	"diet-fitness-backend/internal/middleware"

	"github.com/gorilla/mux"
)

// RegisterAPIRoutes sets up all the API endpoints
func RegisterAPIRoutes(r *mux.Router, db *sql.DB, cfg *config.Config) {
	// Create a subrouter for API endpoints
	api := r.PathPrefix("/api").Subrouter()

	// Add CORS middleware to allow frontend to access
	api.Use(middleware.CORSMiddleware)

	// Public routes (no authentication required)
	api.HandleFunc("/register", handlers.RegisterUser(db)).Methods("POST")
	api.HandleFunc("/login", handlers.LoginUser(db, cfg)).Methods("POST")

	// Protected routes (require JWT authentication)
	// We'll create a subrouter specifically for protected routes
	protected := api.PathPrefix("/").Subrouter()
	protected.Use(auth.JWTMiddleware(cfg.JWTSecret)) // Apply JWT middleware to all routes in this subrouter

	protected.HandleFunc("/dashboard", handlers.GetDashboardData).Methods("GET")
	protected.HandleFunc("/upload", handlers.UploadImage(cfg.UploadDir)).Methods("POST")
	protected.HandleFunc("/generate-plan", handlers.GenerateFitnessPlan).Methods("POST")
	protected.HandleFunc("/plan", handlers.GetFitnessPlan).Methods("GET")

	// Serve static files for uploads (for demonstration/testing)
	// In a real production setup, you might serve these via a CDN or a dedicated static file server.
	r.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir(cfg.UploadDir))))
}
