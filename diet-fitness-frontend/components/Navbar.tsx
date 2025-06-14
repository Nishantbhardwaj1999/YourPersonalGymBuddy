// --- diet-fitness-frontend/components/Navbar.tsx ---
'use client';

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Link from 'next/link';
import { useState } from 'react';
import { useThemeMode } from '../contexts/ThemeModeContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Corrected: using next/navigation for App Router

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useThemeMode();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const router = useRouter(); // Use useRouter from next/navigation

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout(); // AuthContext handles redirect to login
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', authRequired: true },
    { name: 'Upload', href: '/upload', authRequired: true },
    { name: 'My Plan', href: '/plan', authRequired: true },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        FitPlan AI
      </Typography>
      <List>
        {navItems.map((item) => (
          // Only show authenticated items if user is logged in
          (item.authRequired && user) || !item.authRequired ? (
            <ListItem key={item.name} disablePadding>
              <ListItemButton component={Link} href={item.href} sx={{ textAlign: 'center' }}>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ) : null
        ))}
        {user ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center' }}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/login" sx={{ textAlign: 'center' }}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleColorMode} sx={{ textAlign: 'center' }}>
            <ListItemText primary={mode === 'dark' ? 'Switch to Light' : 'Switch to Dark'} />
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" color="primary" elevation={4}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            FitPlan AI
          </Link>
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {navItems.map((item) => (
            // Only show authenticated items if user is logged in
            (item.authRequired && user) || !item.authRequired ? (
              <Button key={item.name} color="inherit" component={Link} href={item.href}>
                {item.name}
              </Button>
            ) : null
          ))}
          {user ? ( // Display user email on logout button if available
            <Button color="inherit" onClick={handleLogout}>Logout ({user.email})</Button>
          ) : (
            <Button color="inherit" component={Link} href="/login">Login</Button>
          )}
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </AppBar>
  );
}