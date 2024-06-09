import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import AuthUserContext from './contexts/AuthUserContext'
import myfetch from './utils/myfetch'

import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material'
import theme from './utils/theme'
import Drawer from './ui/Drawer'

import AuthRoute from './routes/AuthRoute'

import Homepage from './pages/Homepage'
import Cursos from './pages/CursoList'
import NovoCursoForm from './pages/NovoCursoForm'
import EditarCursoForm from './pages/EditarCursoForm'
import Modulos from './pages/ModuloList'
import AulasModulo from './pages/AulasModulo'
import NovoModuloForm from './pages/NovoModuloForm'
import EditarModuloForm from './pages/EditarModuloForm'
import Profs from './pages/ProfList'
import ProfProfile from './pages/ProfProfile'
import NovoProfForm from './pages/NovoProfForm'
import EditarProfForm from './pages/EditarProfForm'
import Disponibilidade from './pages/DisponibForm'
import Alunos from './pages/AlunoList'
import AlunoProfile from './pages/AlunoProfile'
import NovoAlunoForm from './pages/NovoAlunoForm'
import EditarAlunoForm from './pages/EditarAlunoForm'
import Aulas from './pages/AulaList'
import NovaAulaForm from './pages/NovaAulaForm'
import EditarAulaForm from './pages/EditarAulaForm'
import AulaRecord from './pages/AulaRecord'
import NovaAvaliacaoForm from './pages/NovaAvaliacaoForm'
import EditarAvaliacaoForm from './pages/EditarAvaliacaoForm'
import AvaliacaoRecord from './pages/AvaliacaoRecord'

import LoginForm from './pages/LoginForm'

function App() {

  const [authUser, setAuthUser] = React.useState(null)

  async function fetchAuthUser() {
    try {
      const authUser = await myfetch.get('users/me')
      if(authUser) setAuthUser(authUser)
    }
    catch {
      console.error(error)
    }
  }

  React.useEffect(() => {
    fetchAuthUser()
  }, [])

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthUserContext.Provider value={{authUser, setAuthUser}}>
            <Routes>

              <Route path="/login" element={<LoginPage/>} />

              <Route path="/" element={<AuthRoute> <ProtectedPage /> </AuthRoute>} >
                <Route index element={<AuthRoute> <Homepage /> </AuthRoute>} />

                <Route path="/cursos" element={<AuthRoute> <Cursos /> </AuthRoute>} />
                <Route path="/curso/:id" element={<AuthRoute><Modulos/></AuthRoute>} />
                <Route path="/cursos/new" element={<AuthRoute><NovoCursoForm/></AuthRoute>} />
                <Route path="/curso/:id/edit" element={<AuthRoute><EditarCursoForm/></AuthRoute>} />
                
                <Route path="/modulo/:id" element={<AuthRoute><AulasModulo/></AuthRoute>} />
                <Route path="/curso/:id/modulos/new" element={<AuthRoute><NovoModuloForm/></AuthRoute>} />
                <Route path="/modulo/:id/edit" element={<AuthRoute><EditarModuloForm/> </AuthRoute>} />

                <Route path="/profs" element={<AuthRoute><Profs /></AuthRoute>} />
                <Route path="/prof/:id" element={<AuthRoute><ProfProfile/></AuthRoute>} />
                <Route path="/profs/new" element={<AuthRoute><NovoProfForm/></AuthRoute>} />
                <Route path="/prof/:id/edit" element={<AuthRoute><EditarProfForm/></AuthRoute>} />
                <Route path="/prof/:id/disponib" element={<AuthRoute><Disponibilidade/></AuthRoute>} />

                <Route path="/alunos" element={<AuthRoute><Alunos /></AuthRoute>} />
                <Route path="/aluno/:id" element={<AuthRoute><AlunoProfile/></AuthRoute>} />
                <Route path="/alunos/new" element={<AuthRoute><NovoAlunoForm/></AuthRoute>} />
                <Route path="/aluno/:id/edit" element={<AuthRoute><EditarAlunoForm/></AuthRoute>} />

                <Route path="/aulas" element={<AuthRoute><Aulas /></AuthRoute>} />
                <Route path="/modulo/:id/aula/new" element={<AuthRoute><NovaAulaForm /></AuthRoute>} />
                <Route path="/aula/:id" element={<AuthRoute><AulaRecord /></AuthRoute>}/>
                <Route path="/aula/:id/edit" element={<AuthRoute><EditarAulaForm /></AuthRoute>} />

                <Route path="/modulo/:id/avaliacao/new" element={<AuthRoute><NovaAvaliacaoForm /></AuthRoute>} />
                <Route path="/avaliacao/:id" element={<AuthRoute><AvaliacaoRecord /></AuthRoute>} />
                <Route path="/avaliacao/:id/edit" element={<AuthRoute><EditarAvaliacaoForm /></AuthRoute>} />

              </Route>
            </Routes>
          </AuthUserContext.Provider>
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
            marginRight: '50px'
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