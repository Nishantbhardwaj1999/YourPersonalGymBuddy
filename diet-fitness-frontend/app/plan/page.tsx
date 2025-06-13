// --- diet-fitness-frontend/app/dashboard/page.tsx ---
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material'; // Added Button
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function DashboardPage() {
  return (
    <Container sx={{ mt: 8, mb: 4, px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FitnessCenterIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Your Fitness Dashboard
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Welcome back! Here's a snapshot of your progress and key insights.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <RestaurantIcon color="secondary" sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Diet Progress
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Keep up the great work with your high-protein, low-carb diet!
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
              You've been consistent with your 5-day-a-week cardio and strength training.
            </Typography>
            {/* Placeholder for a workout progress chart/summary */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', width: '100%', height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">Graph or detailed stats here</Typography>
            </Box>
            <Button variant="outlined" sx={{ mt: 3 }}>View Workout Details</Button>
          </Paper>
        </Grid>
        {/* More sections can be added here, e.g., recent uploads, recommendations */}
      </Grid>
    </Container>
  );
}