// --- diet-fitness-frontend/app/upload/page.tsx ---
'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, Input, FormHelperText, CircularProgress } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Corrected: using next/navigation for App Router

export default function UploadPage() {
  const { isAuthenticated, authenticatedFetch, loading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect to handle redirection if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('Upload: Not authenticated, redirecting to login.');
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadMessage(''); // Clear previous messages on new file select
      setError('');        // Clear previous errors
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setUploadMessage('');
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile); // The key 'image' must match what your Go backend expects

    try {
      console.log('Upload: Attempting to upload image...');
      // Use authenticatedFetch for sending multipart/form-data
      // No 'Content-Type' header needed for FormData; browser sets it automatically
      const response = await authenticatedFetch('/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); // Assuming backend returns JSON response
      console.log('Upload: API response:', data);

      if (response.ok) {
        setUploadMessage(data.message || 'Image uploaded successfully!');
        setSelectedFile(null); // Clear selected file after successful upload
      } else {
        setError(data.message || 'Image upload failed.');
      }
    } catch (err: any) {
      console.error('Upload: Error during upload:', err.message);
      setError(err.message || 'Network error or server unreachable.');
    } finally {
      setLoading(false);
    }
  };

  // Display a loading spinner if auth context is still loading
  if (authLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading upload page...</Typography>
      </Container>
    );
  }

  // Render the upload form if authenticated and not loading
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          {error && <FormHelperText error sx={{ textAlign: 'center' }}>{error}</FormHelperText>}
          {uploadMessage && <FormHelperText sx={{ color: 'success.main', textAlign: 'center' }}>{uploadMessage}</FormHelperText>}

          <Input
            type="file"
            onChange={handleFileChange}
            disabled={loading}
            sx={{ display: 'block', mb: 2 }}
            inputProps={{ accept: "image/*" }} // Restrict file types
          />
          {selectedFile && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}