import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import logo from '../assets/Sallogo.png';
import { Link } from 'react-router-dom';


export default function PermanentDrawerLeft() {

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: `calc(100% - ${240} px)`,
          height: 100, 
          ml: `${240}px`,
          backgroundColor: '#25254b',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h2" 
            noWrap 
            component="div"
          >
            <img src={logo} alt="Logotipo SaL" style={{ width: '300px'}}/>
            Stop and Learn
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        
        <Toolbar 
          sx={{
            marginTop: '100px',
          }}
        />
        <List>
          {['Início'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to="/"
                sx={{
                  backgroundColor: '#9d2f2e',
                }}
              >
                <ListItemText>Início</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Cursos'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to="/cursos"
                sx={{
                  backgroundColor: '#9d2f2e',
                }}
              >
                <ListItemText>Cursos</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Professores'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to="/profs"
                sx={{
                  backgroundColor: '#9d2f2e',
                }}
              >
                <ListItemText>Professores</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Alunos'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to="/alunos"
                sx={{
                  backgroundColor: '#9d2f2e',
                }}
              >
                <ListItemText>Alunos</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Aulas'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to="/aulas"
                sx={{
                  backgroundColor: '#9d2f2e',
                }}
              >
                <ListItemText>Aulas</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}