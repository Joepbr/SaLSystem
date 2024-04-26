import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import myfetch from '../utils/myfetch'
import AuthUserContext from '../contexts/AuthUserContext'
import Waiting from '../ui/Waiting'

export default function AuthRoute({ children }) {

  const [hasAuthUser, setHasAuthUser] = React.useState() // undefined
  const { setAuthUser } = React.useContext(AuthUserContext)

  const location = useLocation()

  async function checkAuthUser() {
    try {
      await myfetch.get('/users/me')
      setHasAuthUser(true)
    }
    catch(error) {
      console.log(error)
      
      // Apaga as informações do usuário logado no contexto
      setAuthUser(null)
      setHasAuthUser(false)
    }
  }

  React.useEffect(() => {
    checkAuthUser()
  }, [location])

  // Enquanto ainda não temos a resposta do back-end para /users/me,
  // exibimos um componente Waiting
  if(hasAuthUser === undefined) return <Waiting show={true} />

  return hasAuthUser ? children : <Navigate to="/login" replace />
  
}