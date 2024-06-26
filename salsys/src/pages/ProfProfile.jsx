import React from 'react'
import myfetch from '../utils/myfetch'
import { Link, useParams } from 'react-router-dom'

import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Accordion, AccordionSummary, AccordionDetails, Avatar, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, AccordionActions, Stack, Link as MuiLink } from '@mui/material';
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaCalendarDay } from "react-icons/fa6";

import theme from '../utils/theme';
import moment from 'moment';
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

export default function ProfProfile() {
    const { id } = useParams()
    const [prof, setProf] = React.useState(null);
    const [modulos, setModulos] = React.useState([]);
    const [expandedAccordion, setExpandedAccordion] = React.useState(null)
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchProf();
        fetchModulos();
    }, []);

    const fetchProf = async () => {
        try {
            setWaiting(true)
            const profId = id;
            const result = await myfetch.get(`/professores/${profId}`);
            setProf(result);
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    const fetchModulos = async () => {
        try {
            setWaiting(true)
            const profId = id;
            const result = await myfetch.get(`/modulos/professor/${profId}`);
            setModulos(result);
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    const formatDiasSem = (diasSem) => {
        const formatedDias = diasSem.map(dia => dia.dia).join(', ')
        return formatedDias.replace(/,\s*$/, '')
    }

    const formatHorario = (horario) => {
        return moment(horario).format('HH:mm')
    }

    const handleAccordionChange = (index) => {
        setExpandedAccordion(expandedAccordion === index ? null : index);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline>
                    <Waiting show={waiting} />
                    {prof && (
                        <>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                                <Avatar alt={prof.user.nome} src={prof.imageUrl} sx={{ width: 56, height: 56 }} />
                                <Typography variant="h4">{prof.user.nome}</Typography>
                            </Stack>
                            <Typography variant="h6" sx={{ mb: 2 }}>{prof.especialidade} </Typography>
                            {moment().startOf('day').isSame(moment(prof.data_nasc).startOf('day'), 'day') && (
                                <Typography variant="h6">🎉 Feliz Aniversário! 🎉</Typography>
                            )}
                            <Divider />
                            <Box sx={{ margin: "25px" }}>
                                <Typography variant="body1" >
                                    Contatos:
                                    <Box sx={{ mt: 1 }}>
                                        <MdEmail /> <a href={`mailto:${prof.user.email}`}>E-mail</a>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <FaWhatsapp /> <a href={`https://wa.me/${prof.user.telefone}`}>WhatsApp</a>
                                    </Box>
                                </Typography>
                            </Box>
                            {/*<Box display="flex" sx={{ margin: 2 }}>
                                <Button 
                                    component={Link} 
                                    to={`/prof/${prof.id}/disponib`} 
                                    variant="contained"
                                    size="large" 
                                    sx={{ backgroundColor: "#9d2f2e" }}
                                    startIcon={<FaCalendarDay/>}
                                > 
                                    Ajustar Disponibilidade 
                                </Button>
                            </Box>*/}
                        </>
                    )}
                    <Divider />
                    <Box sx={{ mb: 2, mt: 2 }}>
                        <Typography variant="h5">Módulos</Typography>
                    </Box>
                    {modulos.map((modulo, index) => (
                        <Accordion 
                            key={index} 
                            expanded={expandedAccordion === index} 
                            onChange={() => handleAccordionChange(index)} 
                            sx={{ 
                                width: '100%',
                                opacity: modulo.active ? 1 : 0.5,
                                backgroundColor: modulo.active ? 'white' : '#f0f0f0'
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            {expandedAccordion === index ? (
                                <MuiLink component={Link} to={`/modulo/${modulo.id}`} underline="none" color="inherit" style={{ width: '100%' }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar alt={modulo.curso.nome} src={modulo.curso.imageUrl} />
                                        <Typography sx={{ ml: 2 }} variant="h5">{modulo.titulo}</Typography>
                                    </Stack>
                                </MuiLink>
                            ) : (
                                <>
                                    <Avatar alt={modulo.curso.nome} src={modulo.curso.imageUrl} />
                                    <Typography sx={{ ml: 2 }} variant="h5">{modulo.titulo}</Typography>
                                </>
                            )}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{`Dias de aula: ${formatDiasSem(modulo.dias_sem)}, Horário: ${formatHorario(modulo.horario)}`}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </CssBaseline>
            </Container>
        </ThemeProvider>
    )
}