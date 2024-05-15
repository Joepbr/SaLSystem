import React from "react";
import { Typography, Button } from '@mui/material'
import AuthUserContext from "../contexts/AuthUserContext";
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function AuthControl() {
    const { authUser } = React.useContext(AuthUserContext)

    if (authUser) {
        return (
              <>
                <AccountCircleIcon color="secondary" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="caption">
                    {authUser.nome}
                </Typography>
                <Button
                  component={Link}
                  to="/login"
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