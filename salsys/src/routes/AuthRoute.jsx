import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import myfetch from '../utils/myfetch';
import AuthUserContext from '../contexts/AuthUserContext';
import Waiting from '../ui/Waiting';

export default function AuthRoute({ level = 0, children }) {
  const [hasAuthUser, setHasAuthUser] = React.useState(undefined);
  const { authUser, setAuthUser } = React.useContext(AuthUserContext);
  const location = useLocation();

  async function checkAuthUser() {
    try {
      const user = await myfetch.get('/users/me');

      setHasAuthUser(true);
      setAuthUser(user);
    } catch (error) {
      console.error('Error fetching user:', error); // Debugging
      setAuthUser(null);
      setHasAuthUser(false);
    }
  }

  React.useEffect(() => {
    checkAuthUser();
  }, [location]); // Dependency on location to ensure it checks on route change

  // While waiting for auth check to complete
  if (hasAuthUser === undefined) return <Waiting show={true} />;

  if (authUser) {
    const { is_admin, professor, aluno } = authUser;

    // Determine the user's actual level based on their role
    let userLevel = 0;
    if (is_admin) userLevel = 3;
    else if (professor) userLevel = 2;
    else if (aluno) userLevel = 1;

    // Allow access if user's level is greater than or equal to the required level
    if (userLevel >= level) {
      return children;
    }
  }

  // If not authorized, redirect to forbidden page
  return <Navigate to="/forbidden" replace />;
}