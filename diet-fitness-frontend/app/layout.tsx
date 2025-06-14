// --- diet-fitness-frontend/app/layout.tsx ---
// IMPORTANT: NO 'use client' here! This is a Server Component by design.

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

// AuthProvider and ThemeModeProvider
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeModeProvider } from '../contexts/ThemeModeContext';

// Import the new client component that handles ThemeProvider and Navbar
import ThemeAndNavWrapper from '../components/ThemeAndNavWrapper';

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FitPlan AI - Your AI Fitness Companion',
  description: 'Achieve your fitness and diet goals with personalized plans powered by AI.',
};

// The RootLayout component remains a Server Component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <ThemeModeProvider> {/* This provides the theme mode context */}
          <AuthProvider> {/* This provides the authentication context */}
            {/* ThemeAndNavWrapper is a client component that wraps children with MUI ThemeProvider and renders the Navbar */}
            <ThemeAndNavWrapper>
              {children}
            </ThemeAndNavWrapper>
          </AuthProvider>
        </ThemeModeProvider>
      </body>
    </html>
  );
}