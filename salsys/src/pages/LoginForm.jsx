import React from 'react';
import { useNavigate } from 'react-router-dom';
import myfetch from '../utils/myfetch';
import { Paper, Button, TextField, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'
import logo from '../assets/Sallogo.png';
import Notification from '../ui/Notification';
import Waiting from '../ui/Waiting';
import AuthUserContext from '../contexts/AuthUserContext';

export default function LoginForm() {
  const [state, setState] = React.useState({
    showPassword: false,
    username: '',
    password: '',
    showWaiting: false,
    notif: {
      show: false,
      message: '',
      severity: 'success',
      timeout: 1500
    }
  })

  const {
    showPassword,
    username,
    password,
    showWaiting,
    notif
  } = state

  const { setAuthUser } = React.useContext(AuthUserContext)

  const navigate = useNavigate()

  const handleClickShowPassword = () => setState({...state, showPassword: !showPassword})

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  function handleChange(event) {
    setState({...state, [event.target.name]: event.target.value})
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setState({...state, showWaiting: true})

      const response = await myfetch.post('/users/login', { username, password });
      
      window.localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_NAME, response.token);
      
      setAuthUser(response.user)

      setState({...state,
        showWaiting:false,
        notif:{
          show: true,
          message: 'Autenticação realizada com sucesso',
          severity: 'success',
          timeout: 1500
        }})
    } 
    catch (error) {
      console.error(error);

      setState({...state,
        showWaiting: false,
        notif: {
          show: true,
          message: error.message,
          severity: 'error',
          timeout: 4000
        }})
    }
  };

  function handleNotificationClose() {
    const status = notif.severity

    setState({...state, notif: {
      show: false,
      severity: status,
      message: '',
      timeout: 1500
    }})

    if(status ==='success') navigate('/')
  }

  return (
    <>
      <Waiting show={showWaiting} />
      <Notification
        show={notif.show}
        severity={notif.severity}
        message={notif.message}
        timeout={notif.timeout}
        onClose={handleNotificationClose}
      />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          aria-label="Login form"
        >
          <img src={logo} alt="Logotipo SaL" style={{ width: '325px' }} />
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mt: 3,
              mb: 2,
              fontFamily: 'Impact',
              color: "white",
              fontSize: 53,
              textShadow: '-4px 4px 0 #9d2f2e, 4px 4px 0 #9d2f2e, 4px -4px 0 #9d2f2e, -4px -4px 0 #9d2f2e',
              textAlign: 'center',
            }}
          >
            Bem Vindo ao Sistema SaL!
          </Typography>
          <Paper 
            elevation={6}
            sx={{
              padding: '24px',
              maxWidth: '500px',
              margin: 'auto'
            }}
          >
            <form onSubmit={handleSubmit}>
              <TextField 
                  name="username"
                  value={username}
                  onChange={handleChange}
                  label="Usuário" 
                  variant="filled" 
                  fullWidth 
                  sx={{ mb: '24px' }}
              />
              <TextField
                  name="password"
                  value={password}
                  onChange={handleChange}
                  variant="filled"
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  fullWidth
                  sx={{ mb: '24px' }}
                  InputProps={{
                  endAdornment: 
                      <InputAdornment position="end">
                      <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                      >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                      </InputAdornment>
                  }}
              />
              <Button 
                  variant="contained" 
                  type="submit"
                  color="secondary"
                  fullWidth
              >
                  Enviar
              </Button>
            </form>
          </Paper>
        </Box>
    </>
  );
}
