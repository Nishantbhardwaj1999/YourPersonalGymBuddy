// --- diet-fitness-backend/internal/auth/jwt.go ---
package auth

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux" // Mux needed for MiddlewareFunc type
)

// Claims represents the JWT claims
type Claims struct {
	UserID int    `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

// GenerateJWT generates a new JWT token
func GenerateJWT(userID int, email, secret string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour) // Token valid for 24 hours
	claims := &Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "fitplan-ai",
			Subject:   fmt.Sprintf("%d", userID),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", fmt.Errorf("error signing token: %w", err)
	}
	return tokenString, nil
}

// JWTMiddleware validates the JWT token from the Authorization header
func JWTMiddleware(jwtSecret string) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, `{"message": "Authorization header missing"}`, http.StatusUnauthorized)
				return
			}

			// Expecting "Bearer <token>"
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				http.Error(w, `{"message": "Invalid Authorization header format"}`, http.StatusUnauthorized)
				return
			}
			tokenString := parts[1]

			claims := &Claims{}
			token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
				}
				return []byte(jwtSecret), nil
			})

			if err != nil {
				if err == jwt.ErrSignatureInvalid {
					http.Error(w, `{"message": "Invalid token signature"}`, http.StatusUnauthorized)
					return
				}
				log.Printf("JWT parsing error: %v", err) // Log the specific error for debugging
				http.Error(w, `{"message": "Invalid or expired token"}`, http.StatusUnauthorized)
				return
			}

			if !token.Valid {
				http.Error(w, `{"message": "Invalid token"}`, http.StatusUnauthorized)
				return
			}

			// Add user ID and email to the request context for subsequent handlers
			ctx := context.WithValue(r.Context(), "userID", claims.UserID)
			ctx = context.WithValue(ctx, "userEmail", claims.Email)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserIDFromContext retrieves the user ID from the request context
func GetUserIDFromContext(r *http.Request) (int, bool) {
	userID, ok := r.Context().Value("userID").(int)
	return userID, ok
}

// GetUserEmailFromContext retrieves the user email from the request context
func GetUserEmailFromContext(r *http.Request) (string, bool) {
	userEmail, ok := r.Context().Value("userEmail").(string)
	return userEmail, ok
}
