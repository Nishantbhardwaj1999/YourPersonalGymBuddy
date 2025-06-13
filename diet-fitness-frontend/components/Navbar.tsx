// --- diet-fitness-frontend/components/Navbar.tsx ---
'use client';

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icon for light mode
import Link from 'next/link';
import { useState } from 'react';
import { useThemeMode } from '../contexts/ThemeModeContext'; // Import theme mode context

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useThemeMode(); // Use the theme mode context
  const theme = useTheme(); // Use MUI's useTheme hook to access the current theme object

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Upload', href: '/upload' },
    { name: 'My Plan', href: '/plan' },
    { name: 'Login', href: '/login' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        FitPlan AI
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component={Link} href={item.href} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Theme toggle in drawer */}
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
            <Button key={item.name} color="inherit" component={Link} href={item.href}>
              {item.name}
            </Button>
          ))}
          {/* Theme toggle button for desktop */}
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
            keepMounted: true, // Better open performance on mobile.
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