import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material'
import theme from './utils/theme'
import Drawer from './ui/Drawer'

import Homepage from './pages/Homepage'
import Cursos from './pages/CursoList'
import Modulos from './pages/ModuloList'
import Profs from './pages/ProfList'
import Alunos from './pages/AlunoList'
import Aulas from './pages/AulaList'

import LoginForm from './pages/LoginForm'

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

              <Route path="/curso/:id" element={ <Modulos/> } />
            </Route>
          </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

function ProtectedPage({ children }) {
  return (
    <Box 
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#d9d9d9',
        color: 'black',
      }}
    >
      <Drawer/>
        <Box 
          sx={{ 
            marginLeft: '250px',
            marginTop: '100px',
          }}
        >
          <Outlet>
            { children }
          </Outlet>
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