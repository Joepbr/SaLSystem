import React from 'react'
import myfetch from '../utils/myfetch';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Paper, Typography } from '@mui/material';

const localizer = momentLocalizer(moment);

export default function Homepage(){
    return (
        <Container>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                Notícias e Eventos
            </Typography>
            <Paper elevation={3}>
                
            </Paper>
        </Container>
    )
}