// --- diet-fitness-frontend/app/login/page.tsx ---
'use client';

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, CircularProgress } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

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
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Destructure login function from AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login Page: Submitting login form...');
    const result = await login(email, password); // Call login from AuthContext

    if (!result.success) {
      setError(result.message);
      console.error('Login Page: Login failed:', result.message);
    }
    setLoading(false);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: 'calc(100vh - 64px)', // Adjust for Navbar height
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
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
          {error && (
            <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Button variant="text" color="primary" component={Link} href="#">
          Forgot Password?
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
            Sign Up
          </Link>
        </Typography>
      </StyledPaper>
    </Container>
  );
}