// --- diet-fitness-frontend/app/upload/page.tsx ---
'use client'; // This page uses a client component (UploadForm)

import UploadForm from '../../components/UploadForm';
import { Container, Typography, Box, Paper } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export default function UploadPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PhotoCameraIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Upload Your Body Photo
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Upload a clear, full-body photo to help our AI analyze your progress and create personalized plans. Your privacy is important to us.
        </Typography>
        <UploadForm />
      </Paper>
    </Container>
  );
}