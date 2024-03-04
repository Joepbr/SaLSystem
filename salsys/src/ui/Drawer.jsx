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
import { Link, useLocation } from 'react-router-dom';


export default function PermanentDrawerLeft() {

  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Página Inicial'
      case '/cursos':
        return 'Cursos Oferecidos'
      case '/profs':
        return 'Corpo Docente'
      case '/alunos':
        return 'Alunos Matriculados'
      case '/aulas':
        return 'Aulas Registradas'
      default:
        return 'STOP and LEARN'
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: `calc(100% - ${240} px)`,
          height: 80, 
          ml: '240px',
          backgroundColor: '#25254b',
          textShadow: '-4px 4px 0 #104978, 4px 4px 0 #104978, 4px -4px 0 #104978, -4px -4px 0 #104978',
        }}
      >
        <Toolbar>
          <img src={logo} alt="Logotipo SaL" style={{ width: '250px'}}/>
          <Typography 
            variant="h4" 
            noWrap 
            component="div"
            sx={{
              fontFamily: "Impact",
              paddingLeft: '100px',
            }}
          >
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            width: 200,
            boxSizing: 'border-box',
            backgroundColor: '#25254b',
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
                <ListItemText>
                  <Typography
                    sx={{
                      fontFamily: "Impact",
                      textAlign: 'center',
                      textShadow: '-2px 2px 0 #104978, 2px 2px 0 #104978, 2px -2px 0 #104978, -2px -2px 0 #104978',
                    }}
                  >
                    Início
                  </Typography>
                </ListItemText>
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
                <ListItemText>
                <Typography
                    sx={{
                      fontFamily: "Impact",
                      textAlign: 'center',
                      textShadow: '-2px 2px 0 #104978, 2px 2px 0 #104978, 2px -2px 0 #104978, -2px -2px 0 #104978',
                    }}
                  >
                    Cursos
                  </Typography>
                </ListItemText>
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
                <ListItemText>
                <Typography
                    sx={{
                      fontFamily: "Impact",
                      textAlign: 'center',
                      textShadow: '-2px 2px 0 #104978, 2px 2px 0 #104978, 2px -2px 0 #104978, -2px -2px 0 #104978',
                    }}
                  >
                    Professores
                  </Typography>
                </ListItemText>
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
                <ListItemText>
                <Typography
                    sx={{
                      fontFamily: "Impact",
                      textAlign: 'center',
                      textShadow: '-2px 2px 0 #104978, 2px 2px 0 #104978, 2px -2px 0 #104978, -2px -2px 0 #104978',
                    }}
                  >
                    Alunos
                  </Typography>
                </ListItemText>
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
                <ListItemText>
                <Typography
                    sx={{
                      fontFamily: "Impact",
                      textAlign: 'center',
                      textShadow: '-2px 2px 0 #104978, 2px 2px 0 #104978, 2px -2px 0 #104978, -2px -2px 0 #104978',
                    }}
                  >
                    Aulas
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}