// --- diet-fitness-frontend/theme/index.ts ---
import { createTheme, responsiveFontSizes, PaletteMode } from '@mui/material';
import { red } from '@mui/material/colors';

const getAppTheme = (mode: PaletteMode) => {
  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#3f51b5', // A deep blue
      },
      secondary: {
        main: '#f50057', // A vibrant pink
      },
      error: {
        main: red.A400,
      },
      background: {
        default: mode === 'light' ? '#f4f6f8' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : '#b0b0b0',
      },
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
      h1: { fontSize: '3rem' },
      h2: { fontSize: '2.5rem' },
      h3: { fontSize: '2rem' },
      h4: { fontSize: '1.75rem' },
      h5: { fontSize: '1.5rem' },
      h6: { fontSize: '1.25rem' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            // Optional: Adjust AppBar styles
          },
        },
      },
    },
    // You can add more customizations here
  });

  theme = responsiveFontSizes(theme); // Makes font sizes responsive

  return theme;
};

export default getAppTheme;