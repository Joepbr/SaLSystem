import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from '../assets/SALlogo.png';
import MainMenu from './MainMenu';

export default function HeaderBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" enableColorOnDark>
        <Toolbar variant="dense">
          <MainMenu />
          <img src={logo} alt="Logotipo SaL" style={{ width: '300px'}}/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}