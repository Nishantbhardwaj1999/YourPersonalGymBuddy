// --- diet-fitness-frontend/contexts/ThemeModeContext.tsx ---
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeModeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize mode from localStorage or default to 'light'
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') { // Check if running in browser
      const storedMode = localStorage.getItem('themeMode');
      return (storedMode as ThemeMode) || 'light';
    }
    return 'light'; // Default for server-side render or if no localStorage
  });

  // Persist mode to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', mode);
    }
  }, [mode]);

  const toggleColorMode = React.useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleColorMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};