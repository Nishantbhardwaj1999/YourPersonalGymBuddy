// --- diet-fitness-frontend/theme.ts ---
import { createTheme, PaletteMode } from '@mui/material';

// Function to create a theme based on mode
const getAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode, // 'light' or 'dark'
    primary: {
      main: '#4CAF50', // A fresh green for primary actions and branding
      light: '#80e27e',
      dark: '#00701a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFC107', // An inviting amber for secondary actions or highlights
      light: '#fff350',
      dark: '#c79100',
      contrastText: '#212121',
    },
    error: {
      main: '#D32F2F',
    },
    ...(mode === 'light'
      ? { // Light mode specific palette
          background: {
            default: '#F5F5F5', // Light grey background
            paper: '#FFFFFF', // White for cards and surfaces
          },
          text: {
            primary: '#212121',
            secondary: '#757575',
          },
        }
      : { // Dark mode specific palette
          background: {
            default: '#121212', // Dark background
            paper: '#1E1E1E', // Slightly lighter dark for cards/surfaces
          },
          text: {
            primary: '#E0E0E0', // Light text on dark background
            secondary: '#A0A0A0',
          },
        }),
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h3: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
            // Highlight with red on hover
            backgroundColor: mode === 'light' ? '#FFCDD2' : '#B71C1C', // light red in light mode, darker red in dark mode
            color: mode === 'light' ? '#D32F2F' : '#FFEBEE', // red text in light, light red in dark
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiLink: { // Add styling for Next.js Link wrapped by MUI
        styleOverrides: {
            root: {
                '&:hover': {
                    textDecoration: 'underline',
                    color: mode === 'light' ? '#D32F2F' : '#FFCDD2', // Red accent on hover
                },
            },
        },
    },
  },
});

export default getAppTheme; // Export the function now