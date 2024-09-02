import React from 'react'
import { useNavigate } from 'react-router-dom';
import myfetch from '../utils/myfetch';
import { Paper, Button, TextField, Box, Typography } from '@mui/material';
import logo from '../assets/Sallogo.png';
import Notification from '../ui/Notification';
import Waiting from '../ui/Waiting';

export default function ForgotPassword() {
    const [state, setState] = React.useState({
        email: '',
        showWaiting: false,
        notif: {
          show: false,
          message: '',
          severity: 'success',
          timeout: 1500
        }
      })
    
    const {
        email,
        showWaiting,
        notif
    } = state
        
    const navigate = useNavigate()
    
    function handleChange(event) {
        setState({...state, [event.target.name]: event.target.value})
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try{
            setState({ ...state, showWaiting: true })

            await myfetch.post('/users/send-email', { email: state.email })

            setState({
                ...state,
                showWaiting: false,
                notif: {
                    show: true,
                    message: 'Link enviado com sucesso',
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
        if (notif.severity === 'success') navigate('/login')
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
                Insira seu e-mail e enviaremos o link para redefinição de senha.
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
                      name="email"
                      value={email}
                      onChange={handleChange}
                      label="E-mail" 
                      variant="filled" 
                      fullWidth 
                      sx={{ mb: '24px' }}
                  />
                  <Button 
                      variant="contained" 
                      type="submit"
                      color="secondary"
                      fullWidth
                  >
                    Enviar E-mail
                  </Button>
                </form>
              </Paper>
            </Box>
        </>
      );
}