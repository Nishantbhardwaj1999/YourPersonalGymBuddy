// --- diet-fitness-frontend/app/dashboard/page.tsx ---
'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, CircularProgress } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Corrected: using next/navigation for App Router

interface DashboardData {
  message: string;
  user_name: string;
  progress: string; // Example field for diet/workout progress summary
  last_update: string; // Example field for last update time
}

export default function DashboardPage() {
  // Destructure what's needed from AuthContext
  const { isAuthenticated, authenticatedFetch, loading: authLoading } = useAuth();
  const router = useRouter(); // Initialize Next.js router for redirection

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true); // Local loading state for data fetch
  const [error, setError] = useState(''); // Local error state for data fetch

  useEffect(() => {
    // This effect runs whenever isAuthenticated or authLoading changes.
    // We wait for AuthContext to finish its initial loading and token check.
    if (!authLoading) {
      // If not authenticated, redirect to login page.
      if (!isAuthenticated) {
        console.log('Dashboard: Not authenticated, redirecting to login.');
        router.push('/login');
        return; // Stop further execution of this effect
      }

      // If authenticated, proceed to fetch dashboard data.
      const fetchDashboardData = async () => {
        setLoading(true); // Start loading for this component's data
        setError(''); // Clear any previous errors

        try {
          console.log('Dashboard: Attempting to fetch dashboard data...');
          // Use authenticatedFetch from AuthContext for protected API calls
          const response = await authenticatedFetch('/dashboard');
          const data = await response.json(); // Parse the JSON response
          setDashboardData(data); // Set the fetched data to state
          console.log('Dashboard: Data fetched successfully:', data);
        } catch (err: any) {
          // Catch any errors during fetch, including network issues or 401 from backend
          console.error('Dashboard: Error fetching data:', err.message);
          setError(err.message || 'Failed to load dashboard data.');
        } finally {
          setLoading(false); // End loading regardless of success or failure
        }
      };

      fetchDashboardData(); // Call the async function
    }
  }, [isAuthenticated, authLoading, authenticatedFetch, router]); // Dependencies for useEffect.
  // Changes to these values will re-run this effect.

  // Display loading indicator if either auth is loading or dashboard data is loading
  if (loading || authLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading dashboard...</Typography>
      </Container>
    );
  }

  // Display error message if there was a problem fetching data
  if (error) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Error: {error}</Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Try Again</Button>
      </Container>
    );
  }

  // Render the dashboard content once data is loaded and no errors
  return (
    <Container sx={{ mt: 8, mb: 4, px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FitnessCenterIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Your Fitness Dashboard {dashboardData?.user_name ? `for ${dashboardData.user_name}` : ''}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        {dashboardData?.message || 'Welcome back! Here\'s a snapshot of your progress and key insights.'}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <RestaurantIcon color="secondary" sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Diet Progress
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {dashboardData?.progress || 'Keep up the great work with your high-protein, low-carb diet!'} {/* Display dynamic progress */}
            </Typography>
            {/* Placeholder for a diet progress chart/summary */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', width: '100%', height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">Graph or detailed stats here</Typography>
            </Box>
            <Button variant="outlined" sx={{ mt: 3 }}>View Diet Details</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <FitnessCenterIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Workout Progress
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Last Updated: {dashboardData?.last_update || 'N/A'} {/* Display dynamic last update */}
            </Typography>
            {/* Placeholder for a workout progress chart/summary */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', width: '100%', height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">Graph or detailed stats here</Typography>
            </Box>
            <Button variant="outlined" sx={{ mt: 3 }}>View Workout Details</Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}