// --- diet-fitness-frontend/app/login/page.tsx ---
'use client'; // Keep this at the top!

import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles'; // <--- IMPORT useTheme HERE
import Link from 'next/link';
// import theme from '../../theme'; // <--- REMOVE THIS IMPORT - YOU'LL USE useTheme() INSTEAD

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  alignItems: 'center',
  boxShadow: theme.shadows[6],
  borderRadius: theme.shape.borderRadius,
  width: '100%',
}));

export default function LoginPage() {
  const theme = useTheme(); // <--- CALL THE useTheme HOOK HERE TO GET THE THEME OBJECT

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome Back!
        </Typography>
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          autoComplete="email"
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          autoComplete="current-password"
          required
        />
        <Button variant="contained" color="primary" fullWidth size="large">
          Login
        </Button>
        <Button variant="text" color="primary" component={Link} href="#">
          Forgot Password?
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          {/* Now, theme.palette.primary.main will correctly resolve */}
          <Link href="#" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
            Sign Up
          </Link>
        </Typography>
      </StyledPaper>
    </Container>
  );
}