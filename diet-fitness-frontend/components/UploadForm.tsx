// --- diet-fitness-frontend/components/UploadForm.tsx ---
'use client'; // State management and browser APIs are used here

import { useState } from 'react';
import { Button, Box, Input, FormHelperText, IconButton, CircularProgress, Typography } from '@mui/material'; // Added Typography
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setUploadStatus('idle'); // Reset status when new file is selected
    } else {
      setFile(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('error'); // Indicate no file selected
      return;
    }

    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Replace with your actual API endpoint for image upload
      // const response = await fetch('/api/upload', { method: 'POST', body: formData });
      // if (response.ok) {
        setUploadStatus('success');
        console.log('Upload successful!');
        // Optionally clear the file after successful upload
        // setFile(null);
      // } else {
      //   setUploadStatus('error');
      //   console.error('Upload failed:', response.statusText);
      // }
    } catch (error) {
      setUploadStatus('error');
      console.error('Network error during upload:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: file ? 'primary.main' : 'grey.400',
          borderRadius: 2,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.3s ease-in-out',
          '&:hover': {
            borderColor: 'primary.light',
          },
        }}
      >
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <IconButton color="primary" component="span" size="large">
            <CloudUploadIcon sx={{ fontSize: 60 }} />
          </IconButton>
          <Typography variant="body1" sx={{ mt: 1, color: 'text.primary' }}>
            {file ? file.name : 'Drag & Drop your image here or Click to Browse'}
          </Typography>
          <FormHelperText sx={{ mt: 1, textAlign: 'center' }}>
            Accepted formats: JPG, PNG. Max size: 5MB.
          </FormHelperText>
        </label>
        {file && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {file.name}
            </Typography>
            <IconButton size="small" onClick={handleRemoveFile} aria-label="remove file">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        size="large"
        disabled={!file || uploadStatus === 'uploading'}
        startIcon={uploadStatus === 'success' ? <CheckCircleIcon /> : (uploadStatus === 'uploading' ? <CircularProgress size={20} color="inherit" /> : undefined)}
      >
        {uploadStatus === 'uploading' ? 'Uploading...' : uploadStatus === 'success' ? 'Uploaded!' : 'Upload Image'}
      </Button>
      {uploadStatus === 'error' && (
        <FormHelperText error sx={{ textAlign: 'center' }}>
          {file ? 'Upload failed. Please try again.' : 'Please select a file to upload.'}
        </FormHelperText>
      )}
    </Box>
  );
}