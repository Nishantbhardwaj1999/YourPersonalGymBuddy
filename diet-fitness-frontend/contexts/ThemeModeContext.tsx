// --- diet-fitness-frontend/contexts/ThemeModeContext.tsx ---
'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { PaletteMode } from '@mui/material';

interface ThemeModeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light'); // Default to light

  // Effect to load saved theme preference from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode;
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Check for user's system preference if no saved mode
      setMode('dark');
    }
  }, []);

  const toggleColorMode = useMemo(
    () => () => {
      setMode((prevMode) => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('themeMode', newMode); // Save preference
        return newMode;
      });
    },
    [],
  );

  const value = useMemo(() => ({ mode, toggleColorMode }), [mode, toggleColorMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}