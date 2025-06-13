// --- diet-fitness-frontend/app/page.tsx (Landing Page) ---
import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', // Adjust for Navbar height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        bgcolor: 'background.default', // Use the background color from theme
        py: 8,
        px: 2, // Add horizontal padding
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ color: 'text.primary', fontWeight: 700 }}
        >
          Achieve Your Fitness Goals with AI
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Track your diet and fitness journey, get personalized plans, and see your progress come to life with FitPlan AI.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            href="/login"
            sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }} // Stack buttons on small screens
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            href="/dashboard" // Or another introductory page
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
}