import React from 'react'
import './App.css'
import { ThemeProvider } from '@mui/material/styles'
import theme from './utils/theme'
import Box from '@mui/material/Box'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import Drawer from './ui/Drawer'

import Homepage from './pages/Homepage'
import Cursos from './pages/CursoList'
import Profs from './pages/ProfList'
import Alunos from './pages/AlunoList'
import Aulas from './pages/AulaList'

function App() {

  return (
    <>
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Reseta o CSS padrão e adapta para o tema */}
        <Box sx={{
          width: '100vw', //toda a alrgura da janela
          minHeight: '100vh', //no mínimo, toda a altura da janela
          //cinza escuro, no modo dark
          backgroundColor: '#d9d9d9',
          color: 'black',
        }}>
          <Drawer/>
          <Box 
            sx={{ 
              marginLeft: '250px',
              marginTop: '100px',
            }}>
            <Routes>
            <Route path="/" element={ <Homepage /> } />
            <Route path="/cursos" element={ <Cursos /> } />
            <Route path="/profs" element={ <Profs /> } />
            <Route path="/alunos" element={ <Alunos /> } />
            <Route path="/aulas" element={ <Aulas /> } />
          </Routes>
          </Box>
        </Box>
      </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App