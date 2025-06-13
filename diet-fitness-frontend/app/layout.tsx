// --- diet-fitness-frontend/app/layout.tsx ---
// IMPORTANT: NO 'use client' directive here! This is a Server Component.

import type { Metadata } from 'next';
import AppProviders from './providers'; // Import your client-side providers
import './globals.css'; // Import global CSS

// Static metadata export - this runs on the server to populate the <head>
export const metadata: Metadata = {
  title: 'FitPlan AI - Your AI Fitness Companion', // Specific and descriptive title
  description: 'Achieve your fitness and diet goals with personalized plans powered by AI.',
  // You can add other static head elements like favicons if needed:
  // icons: {
  //   icon: '/favicon.ico', // assuming you have a favicon.ico in your public folder
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // AppProviders now handles the <html> and <body> tags,
    // and provides the Material-UI context.
    <AppProviders>
      {children}
    </AppProviders>
  );
}