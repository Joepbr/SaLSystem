import React, { useState } from 'react';
import myfetch from '../utils/myfetch'; // Import myfetch.js file
import { Button, CssBaseline, TextField, Box, Typography, Container, ThemeProvider } from '@mui/material';
import logo from '../assets/Sallogo.png';
import theme from '../utils/theme'

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // create error states
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await myfetch.post('/login', { username, password });
      // If login successful, redirect or perform desired action
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (display error message, reset form, etc.)
      setUsernameError('Wrong username or password');
      setPasswordError('Wrong username or password');
    }
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
          <img src={logo} alt="Logotipo SaL" style={{ width: '325px'}}/>
          <Typography 
            component="h1" 
            variant="h5" 
            sx={{
              mt: 3, 
              mb: 2, 
              fontFamily: "Impact",
              fontSize: 53,
              textShadow: '-4px 4px 0 #9d2f2e, 4px 4px 0 #9d2f2e, 4px -4px 0 #9d2f2e, -4px -4px 0 #9d2f2e',
              textAlign: "center",
              }}
          >
            Bem Vindo ao Sistema SaL!
          </Typography>
          <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} aria-labelledby="login-form">
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário"
              name="username"
              autoComplete="usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameError != null}
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
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError != null}
              helperText={passwordError}
            />
            <Button 
              type="submit"
              size='large'
              fullWidth
              variant="contained"
              sx={{
                fontFamily: "Impact",
                textShadow: '-2px 2px 0 #104978, 2px 2px 0 #104978, 2px -2px 0 #104978, -2px -2px 0 #104978',
                backgroundColor: "#9d2f2e",
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