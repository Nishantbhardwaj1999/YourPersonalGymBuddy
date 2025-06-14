// --- diet-fitness-frontend/contexts/AuthContext.js ---
'use client'; // This directive must be at the very top of the file

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation'; // Corrected: using next/navigation for App Router
import { API_BASE_URL } from '../lib/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user email
    const [token, setToken] = useState(null); // Stores the JWT token
    const [loading, setLoading] = useState(true); // Manages initial load state of context
    const router = useRouter(); // Next.js Router hook from next/navigation

    useEffect(() => {
        // This effect runs once on component mount to check for stored token
        const storedToken = localStorage.getItem('jwtToken');
        const storedUserEmail = localStorage.getItem('userEmail');

        if (storedToken && storedUserEmail) {
            setToken(storedToken);
            setUser({ email: storedUserEmail });
            console.log('AuthContext: Found stored token and user.');
        } else {
            console.log('AuthContext: No stored token or user found.');
        }
        setLoading(false); // Authentication context finished loading
    }, []);

    const login = async (email, password) => {
        setLoading(true); // Indicate loading for the login process
        console.log(`AuthContext: Attempting login for ${email}...`);
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('AuthContext: Login API response:', data);

            if (response.ok) { // HTTP status 200-299
                const newToken = data.token;
                const userEmail = data.email; // Assuming backend returns user email
                setToken(newToken);
                setUser({ email: userEmail });
                localStorage.setItem('jwtToken', newToken);
                localStorage.setItem('userEmail', userEmail);
                console.log('AuthContext: Login successful. Navigating to /dashboard.');
                router.push('/dashboard'); // Navigate to dashboard
                return { success: true };
            } else {
                console.error('AuthContext: Login failed, server message:', data.message);
                return { success: false, message: data.message || 'Login failed: Unknown error.' };
            }
        } catch (error) {
            console.error('AuthContext: Network error during login:', error);
            return { success: false, message: 'Network error or server unreachable. Please check your backend.' };
        } finally {
            setLoading(false); // Login process finished
        }
    };

    const register = async (email, password) => {
        setLoading(true); // Indicate loading for the registration process
        console.log(`AuthContext: Attempting registration for ${email}...`);
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('AuthContext: Register API response:', data);

            if (response.ok) {
                console.log('AuthContext: Registration successful.');
                // Optionally log the user in directly or redirect to login
                return { success: true, message: data.message || 'Registration successful!' };
            } else {
                console.error('AuthContext: Registration failed, server message:', data.message);
                return { success: false, message: data.message || 'Registration failed: Unknown error.' };
            }
        } catch (error) {
            console.error('AuthContext: Network error during registration:', error);
            return { success: false, message: 'Network error or server unreachable. Please check your backend.' };
        } finally {
            setLoading(false); // Registration process finished
        }
    };

    const logout = () => {
        console.log('AuthContext: Logging out...');
        setToken(null);
        setUser(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        router.push('/login'); // Redirect to login page on logout
    };

    // Helper function for making authenticated API requests
    const authenticatedFetch = async (endpoint, options = {}) => {
        const currentToken = localStorage.getItem('jwtToken'); // Always get fresh token from localStorage
        if (!currentToken) {
            console.warn('AuthContext: No token found for authenticated request. Forcing logout.');
            logout(); // Force logout if no token is present when trying to make an auth request
            throw new Error('Authentication required: No token found.');
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${currentToken}`, // Add JWT to Authorization header
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
            console.log(`AuthContext: Authenticated fetch to ${endpoint}, status: ${response.status}`);

            if (response.status === 401) { // If backend returns 401 (Unauthorized)
                console.warn('AuthContext: Token expired or invalid. Forcing logout.');
                logout(); // Log out user automatically
                throw new Error('Unauthorized: Session expired or invalid token.'); // <--- THIS LINE WAS MISSING
            }

            if (!response.ok) { // Handle other non-2xx responses
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                console.error(`AuthContext: API error for ${endpoint}:`, errorData.message || response.statusText);
                throw new Error(errorData.message || `API error: ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error(`AuthContext: Network error during authenticated fetch to ${endpoint}:`, error);
            throw error; // Re-throw to be caught by component
        }
    }; // <--- THIS BRACE CLOSES authenticatedFetch

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, authenticatedFetch, isAuthenticated: !!token }}>
            {/* Only render children when the auth context has finished its initial loading */}
            {!loading && children}
        </AuthContext.Provider>
    );
}; // <--- THIS BRACE CLOSES AuthProvider

export const useAuth = () => useContext(AuthContext); // <--- END OF FILE