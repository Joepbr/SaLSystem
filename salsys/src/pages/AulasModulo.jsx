import React from 'react';
import myfetch from '../utils/myfetch';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Divider, Button, Accordion, AccordionSummary, AccordionDetails, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaBook } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
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
            <Typography variant="h6">{modulo ? 
                    <Box>
                        <Box>
                            Dias de aula: {formatDiasSem(modulo.dias_sem)}
                        </Box>
                        <Box>
                            Horário: {formatHorario(modulo.horario)}
                        </Box>
                    </Box>
                : 'Carregando...'}
            </Typography>
            <Divider />
            <Box sx={{ margin: "25px" }}>
                <Typography>
                    <Box>
                        <FaBook /> {modulo ? <a href={`https://www.amazon.com/s?k=${encodeURIComponent(modulo.livro)}`}>Livro: {modulo.livro}</a> : 'Carregando...'}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <FaWhatsapp /> {modulo ? <a href={`${modulo.wagrupo}`}>Grupo no WhatsApp</a> : 'Carregando'}
                    </Box>
                </Typography>
            </Box>
            <Divider />
            <Box display="flex" sx={{ margin: 2 }}>
                <Button component={Link} to={`/modulo/${id}/aula/new`} variant="contained" sx={{ backgroundColor: "#9d2f2e" }}> Registrar Nova Aula </Button>
            </Box>
        </Container>
    )
}