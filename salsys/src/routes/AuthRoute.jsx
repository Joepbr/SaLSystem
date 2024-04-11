import React from "react";
import { Route, useNavigate } from 'react-router-dom'
import myfetch from "../utils/myfetch";

export default async function AuthRoute({props}) {
    const navigate = useNavigate()

    try {
        const user = await myfetch.get('/users/me')
        return <Route {...props} />
    }
    catch(error) {
        console.error(error)
        navigate('/login')
    }
}