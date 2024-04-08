import React from 'react';
import myfetch from '../utils/myfetch';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Divider, Button, Accordion, AccordionSummary, AccordionDetails, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';

moment.locale('pt-br');

export default function AulasModulo() {
    const { id } = useParams()
    const [modulo, setModulo] = React.useState(null);
    const [aulas, setAulas] = React.useState([]);

    React.useEffect(() => {
        fetchModulo();
        fetchAulas()
    }, []);

    const fetchModulo = async () => {
        try {
            const moduloId = id;
            const result = await myfetch.get(`/modulos/${moduloId}`);
            setModulo(result);
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    const fetchAulas = async () => {
    try {
        const moduloId = id
        const result = await myfetch.get(`/aulas/modulo/${moduloId}`)
        setAulas(result)
    } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    }

    const formatDiasSem = (diasSem) => {
        const formatedDias = diasSem.map(dia => dia.dia).join(', ')
        return formatedDias.replace(/,\s*$/, '')
    }

    const formatHorario = (horario) => {
        return moment(horario).format('HH:mm')
    }

    return (
        <Container>
            <Typography variant="h4">{modulo ? modulo.titulo : 'Carregando...'}</Typography>
            <Divider />
            <Typography variant="h6">{modulo ? `Dias de aula: ${formatDiasSem(modulo.dias_sem)}, Horário: ${formatHorario(modulo.horario)}` : 'Carregando...'}</Typography>
        </Container>
    )
}