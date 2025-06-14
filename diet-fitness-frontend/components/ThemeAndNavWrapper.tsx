// --- diet-fitness-frontend/components/ThemeAndNavWrapper.tsx ---
'use client'; // This directive MUST be at the very top of this file.

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navbar from './Navbar'; // Adjust path if Navbar is elsewhere
import getAppTheme from '../theme'; // Adjust path based on your theme file location
import { useThemeMode } from '../contexts/ThemeModeContext'; // Adjust path

// This component now uses client-side hooks and is correctly marked as a client component.
export default function ThemeAndNavWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  const theme = React.useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={{ paddingTop: '64px' /* Adjust based on your Navbar height */ }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}