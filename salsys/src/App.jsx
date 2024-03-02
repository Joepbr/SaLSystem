import React from 'react'
import './App.css'
import { ThemeProvider } from '@mui/material/styles'
import theme from './utils/theme'
import Box from '@mui/material/Box'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import Drawer from './ui/Drawer'

import Homepage from './pages/Homepage'
import ProfList from './pages/ProfList'
import AlunosList from './pages/AlunoList'

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
          backgroundColor: 'background.default'
        }}>
          <Drawer/>
          <Box sx={{ m: '25px' /*Margem de 5px de todos os lados*/}}>
            <Routes>
            <Route path="/" element={ <Homepage /> } />
            <Route path="/cars" element={ <ProfList /> } />
            <Route path="/customers" element={ <AlunosList /> } />
          </Routes>
          </Box>
        </Box>
      </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App