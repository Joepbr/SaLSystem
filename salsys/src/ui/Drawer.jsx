import * as React from 'react';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemText, Button} from '@mui/material';
import logo from '../assets/Sallogo.png';
import { Link, useLocation } from 'react-router-dom';
import AuthControl from './AuthControl';

export default function PermanentDrawerLeft() {

  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Página Inicial'
      case '/cursos':
        return 'Cursos Oferecidos'
      case '/cursos/new':
        return 'Criar Curso'
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
        }}
      >
        <Toolbar>
          <img src={logo} alt="Logotipo SaL" style={{ width: '250px'}}/>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h4" 
              noWrap 
              component="div"
              sx={{
                textAlign: 'center',
                fontFamily: "Impact",
                paddingLeft: '100px',
                textShadow: '-4px 4px 0 #104978, 4px 4px 0 #104978, 4px -4px 0 #104978, -4px -4px 0 #104978',
              }}
            >
              {getPageTitle()}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '350px',
              textAlign: 'center'
            }}
          >
            <AuthControl />
          </Box>
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
                      color: "white",
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
                      color: "white",
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
                      color: "white",
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
                      color: "white",
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
                      color: "white",
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