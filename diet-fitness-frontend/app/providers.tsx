// --- diet-fitness-frontend/app/providers.tsx ---
'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getAppTheme from '../theme'; // Import the function now
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';

// Import the Montserrat font using Next.js's font optimization
import { Montserrat } from 'next/font/google';
const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

import { ThemeModeProvider, useThemeMode } from '../contexts/ThemeModeContext'; // Import context

// This component uses the theme mode and provides the actual MUI ThemeProvider
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode(); // Get the current theme mode from context
  const theme = React.useMemo(() => getAppTheme(mode), [mode]); // Create theme based on mode

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets CSS and applies baseline styles */}
      <Navbar /> {/* Your global navigation bar */}
      {/* Main content area, with padding to avoid overlap with fixed Navbar */}
      <Box component="main" sx={{ paddingTop: '64px' /* Adjust based on your Navbar height */ }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}

// This is the main provider that wraps the entire app
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    // Apply the font class to the <html> tag
    <html lang="en" className={montserrat.className}>
      <body>
        <ThemeModeProvider> {/* Provide the theme mode context */}
          <ThemeWrapper>{children}</ThemeWrapper> {/* Wrap with the theme provider */}
        </ThemeModeProvider>
      </body>
    </html>
  );
}