// --- diet-fitness-frontend/app/register/page.tsx ---
'use client';

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, CircularProgress } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Corrected: using next/navigation for App Router

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

export default function RegisterPage() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); // Destructure register function from AuthContext
  const router = useRouter(); // Use useRouter from next/navigation for manual redirects

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    console.log('Register Page: Submitting registration form...');
    const result = await register(email, password); // Call register from AuthContext

    if (result.success) {
      setSuccessMessage(result.message);
      console.log('Register Page: Registration successful, redirecting to /login...');
      // Redirect to login page after a short delay for user to see success message
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setError(result.message);
      console.error('Register Page: Registration failed:', result.message);
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
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
          {error && (
            <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography color="primary" variant="body2" sx={{ textAlign: 'center' }}>
              {successMessage}
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
            Login here
          </Link>
        </Typography>
      </StyledPaper>
    </Container>
  );
}