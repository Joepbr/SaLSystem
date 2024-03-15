import React from 'react'
import './App.css'
import { ThemeProvider } from '@mui/material/styles'
import theme from './utils/theme'
import Box from '@mui/material/Box'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import Drawer from './ui/Drawer'
import Container from '@mui/material/Container'

import Homepage from './pages/Homepage'
import Cursos from './pages/CursoList'
import Profs from './pages/ProfList'
import Alunos from './pages/AlunoList'
import Aulas from './pages/AulaList'

import LoginForm from './ui/LoginForm'

function App() {

  return (
    <>
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
            <Routes>

            <Route path="/login" element={<LoginPage/>} />

            <Route path="/" element={<ProtectedPage />} >
              <Route index element={ <Homepage /> } />
              <Route path="/cursos" element={ <Cursos /> } />
              <Route path="/profs" element={ <Profs /> } />
              <Route path="/alunos" element={ <Alunos /> } />
              <Route path="/aulas" element={ <Aulas /> } />
            </Route>
          </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

function ProtectedPage({ children, ...props }) {
  return (
    <Box 
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#d9d9d9',
        color: 'black',
      }}
      {...props}
    >
      <Drawer/>
        <Box 
          sx={{ 
            marginLeft: '250px',
            marginTop: '100px',
          }}
        >
          {children}
        </Box>
    </Box>
  );
}

function LoginPage() {
  return (
    <Box
      sx={{
        backgroundColor: '#25254b',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container component="main" maxWidth="xs">
        <LoginForm />
      </Container>
    </Box>
  );
}

export default App