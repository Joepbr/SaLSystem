import React, { useState } from 'react';
import myfetch from '../utils/myfetch';
import { Button, CssBaseline, TextField, Box, Typography, Container, ThemeProvider } from '@mui/material';
import logo from '../assets/Sallogo.png';
import theme from '../utils/theme';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await myfetch.post('/users/login', { username, password });
      //check if response contains a token
      if (response.data && response.data.token){
        const { token } = response.data; //Store token in localStorage
        localStorage.setItem('token', token); // Store token in localStorage
        // Redirect or perform desired action
      } else {
        console.error('Login failed: Invalid response format')
        setLoginError('Ocorreu um erro. Tente novamente mais tarde')
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.status === 401) {
        setLoginError('Usuário ou senha incorretos');
      } else {
        setLoginError('Ocorreu um erro. Tente novamente mais tarde.');
      }
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError(null); // Clear username error when user starts typing
    setLoginError(null); // Clear login error when user starts typing
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(null); // Clear password error when user starts typing
    setLoginError(null); // Clear login error when user starts typing
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
              fontSize: 53,
              textShadow: '-4px 4px 0 #9d2f2e, 4px 4px 0 #9d2f2e, 4px -4px 0 #9d2f2e, -4px -4px 0 #9d2f2e',
              textAlign: 'center',
            }}
          >
            Bem Vindo ao Sistema SaL!
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} aria-labelledby="login-form">
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário"
              name="username"
              autoComplete="usuário"
              value={username}
              onChange={handleUsernameChange}
              error={!!usernameError}
              helperText={usernameError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Typography variant="body2" color="error" align="center">
              {loginError}
            </Typography>
            <Button
              type="submit"
              size="large"
              fullWidth
              variant="contained"
              sx={{
                fontFamily: 'Impact',
                textShadow: '-2px 2px 0 #104978, 2px 2px 0 #104978, 2px -2px 0 #104978, -2px -2px 0 #104978',
                backgroundColor: '#9d2f2e',
                fontSize: 25,
                mt: 2,
                mb: 2,
              }}
              aria-label="Click to login"
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LoginForm;
