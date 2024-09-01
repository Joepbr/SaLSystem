import React from 'react'
import { useNavigate } from 'react-router-dom';
import myfetch from '../utils/myfetch';
import { Paper, Button, TextField, Box, Typography } from '@mui/material';
import logo from '../assets/Sallogo.png';
import Notification from '../ui/Notification';
import Waiting from '../ui/Waiting';

export default function ResetPassword() {
    const [state, setState] = React.useState({
        password: '',
        confirmPassword: '',
        showWaiting: false,
        notif: {
          show: false,
          message: '',
          severity: 'success',
          timeout: 1500
        }
      })
    
    const {
        password,
        confirmPassword,
        showWaiting,
        notif
    } = state
        
    const navigate = useNavigate()
    
    function handleChange(event) {
        setState({...state, [event.target.name]: event.target.value})
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (password !== confirmPassword) {
            setState({
                ...state,
                notif: {
                    show: true,
                    message: 'Nova senha não confirmada',
                    severity: 'error',
                    timeout: 3000,
                }
            })
            return
        }
        try{
            setState({ ...state, showWaiting: true })

            await myfetch.post('/users/reset-password', {password: password})

            setState({
                ...state,
                showWaiting: false,
                notif: {
                    show: true,
                    message: 'Senha modificada com sucesso',
                    severity: 'success',
                    timeout: 1500
                }
            })
        } catch (error) {
            console.error(error)
            setState({
                ...state,
                showWaiting: false,
                notif: {
                    show: true,
                    message: error.message,
                    severity: 'error',
                    timeout: 4000
                }
            })
        }
    }

    function handleNotificationClose() {
        setState({ ...state, notif: { ...notif, show: false } })
        if (notif.severity === 'success') navigate('/')
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
                alignItems: 'center'
              }}
              aria-label="Reset Password form"
            >
              <img src={logo} alt="Logotipo SaL" style={{ width: '325px' }} />
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 35,
                  textAlign: 'center',
                }}
              >
                Por favor, crie uma nova senha para acessar o sistema.
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
                      name="password"
                      value={password}
                      onChange={handleChange}
                      label="Nova Senha" 
                      variant="filled" 
                      type={'password'}
                      fullWidth 
                      sx={{ mb: '24px' }}
                  />
                  <TextField
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      variant="filled"
                      type={'password'}
                      label="Confirmar Nova Senha"
                      fullWidth
                      sx={{ mb: '24px' }}
                  />
                  <Button 
                      variant="contained" 
                      type="submit"
                      color="secondary"
                      fullWidth
                  >
                      Mudar Senha
                  </Button>
                </form>
              </Paper>
            </Box>
        </>
      );
}