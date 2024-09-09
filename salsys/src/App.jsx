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
import Forbidden from './pages/Forbidden'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'
import ResetPasswordToken from './pages/ResetPasswordToken'

function App() {

  const [authUser, setAuthUser] = React.useState(null)

  async function fetchAuthUser() {
    try {
      const authUser = await myfetch.get('/users/me')
      if(authUser) setAuthUser(authUser)
    }
    catch (error) {
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

              <Route path="/login" element={<LoginPage/>} >
                <Route index element={<LoginForm/>} />
                <Route path="/login/reset-password" element={<AuthRoute level={1}><ResetPassword/></AuthRoute>} />
                <Route path="/login/reset-password/:token" element={<ResetPasswordToken/>} />
                <Route path="/login/forgot-password" element={<ForgotPassword/>}/>
              </Route>

              <Route path="/" element={<AuthRoute level={0}> <ProtectedPage /> </AuthRoute>} >
                <Route index element={<AuthRoute level={1}> <Homepage /> </AuthRoute>} />

                <Route path="/forbidden" element={<AuthRoute level={0}> <Forbidden /> </AuthRoute>} />

                <Route path="/cursos" element={<AuthRoute level={1}> <Cursos /> </AuthRoute>} />
                <Route path="/curso/:id" element={<AuthRoute level={1}><Modulos/></AuthRoute>} />
                <Route path="/cursos/new" element={<AuthRoute level={3}><NovoCursoForm/></AuthRoute>} />
                <Route path="/curso/:id/edit" element={<AuthRoute level={3}><EditarCursoForm/></AuthRoute>} />
                
                <Route path="/modulo/:id" element={<AuthRoute level={1}><AulasModulo/></AuthRoute>} />
                <Route path="/curso/:id/modulos/new" element={<AuthRoute level={3}><NovoModuloForm/></AuthRoute>} />
                <Route path="/modulo/:id/edit" element={<AuthRoute level={3}><EditarModuloForm/> </AuthRoute>} />

                <Route path="/profs" element={<AuthRoute level={1}><Profs /></AuthRoute>} />
                <Route path="/prof/:id" element={<AuthRoute level={1}><ProfProfile/></AuthRoute>} />
                <Route path="/profs/new" element={<AuthRoute level={3}><NovoProfForm/></AuthRoute>} />
                <Route path="/prof/:id/edit" element={<AuthRoute level={3}><EditarProfForm/></AuthRoute>} />
                <Route path="/prof/:id/disponib" element={<AuthRoute level={2}><Disponibilidade/></AuthRoute>} />

                <Route path="/alunos" element={<AuthRoute level={1}><Alunos /></AuthRoute>} />
                <Route path="/aluno/:id" element={<AuthRoute level={1}><AlunoProfile/></AuthRoute>} />
                <Route path="/alunos/new" element={<AuthRoute level={3}><NovoAlunoForm/></AuthRoute>} />
                <Route path="/aluno/:id/edit" element={<AuthRoute level={3}><EditarAlunoForm/></AuthRoute>} />

                <Route path="/aulas" element={<AuthRoute level={1}><Aulas /></AuthRoute>} />
                <Route path="/modulo/:id/aula/new" element={<AuthRoute level={2}><NovaAulaForm /></AuthRoute>} />
                <Route path="/aula/:id" element={<AuthRoute level={1}><AulaRecord /></AuthRoute>}/>
                <Route path="/aula/:id/edit" element={<AuthRoute level={2}><EditarAulaForm /></AuthRoute>} />

                <Route path="/modulo/:id/avaliacao/new" element={<AuthRoute level={2}><NovaAvaliacaoForm /></AuthRoute>} />
                <Route path="/avaliacao/:id" element={<AuthRoute level={1}><AvaliacaoRecord /></AuthRoute>} />
                <Route path="/avaliacao/:id/edit" element={<AuthRoute level={2}><EditarAvaliacaoForm /></AuthRoute>} />

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

function LoginPage({ children }) {
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
        <Outlet>
          { children }
        </Outlet>
      </Container>
    </Box>
  );
}

export default App