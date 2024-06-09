import React from "react";
import { Typography, Button } from '@mui/material'
import AuthUserContext from "../contexts/AuthUserContext";
import { Link, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useConfirmDialog from "./useConfirmDialog";
import myfetch from "../utils/myfetch";

export default function AuthControl() {
    const { authUser, setAuthUser } = React.useContext(AuthUserContext)

    const { askForConfirmation, ConfirmDialog } = useConfirmDialog()

    const navigate = useNavigate()

    async function handleLogoutButtonClick() {
      if(await askForConfirmation('Deseja realmente sair?')) {
        try {
          await myfetch.post('/users/logout')
          
          setAuthUser(null)
  
          navigate('/login')
        }
        catch(error) {
          console.error(error)
        }
      }
    }

    if (authUser) {
        return (
              <>
                <ConfirmDialog />
                
                <AccountCircleIcon color="secondary" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="caption">
                    {authUser.nome}
                </Typography>
                <Button
                  size="small"
                  onClick={handleLogoutButtonClick}
                  sx={{
                    backgroundColor: '#9d2f2e',
                    ml: 2
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Impact",
                      color: "white",
                      textShadow: '-2px 2px 0 #104978, 2px 2px 0 #104978, 2px -2px 0 #104978, -2px -2px 0 #104978',
                    }}
                  >
                  Sair
                </Typography>
              </Button>
            </>
        )
    }
    else{
        return (
            <Button
              component={Link}
              to="/login"
              sx={{
                backgroundColor: '#9d2f2e',
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Impact",
                  color: "white",
                  textShadow: '-2px 2px 0 #104978, 2px 2px 0 #104978, 2px -2px 0 #104978, -2px -2px 0 #104978',
                }}
              >
                Login
              </Typography>
            </Button>
        )
    }
}