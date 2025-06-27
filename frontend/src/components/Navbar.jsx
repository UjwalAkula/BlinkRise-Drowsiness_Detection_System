// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
          Drowsiness Monitor
        </Typography>
        {/* You can add more nav items here if needed */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;