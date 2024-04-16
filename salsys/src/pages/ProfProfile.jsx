import React from 'react'
import myfetch from '../utils/myfetch'
import { Link, useParams } from 'react-router-dom'

import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Accordion, AccordionSummary, AccordionDetails, Avatar, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, AccordionActions, Stack, Link as MuiLink } from '@mui/material';
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import theme from '../utils/theme';
import moment from 'moment';

moment.locale('pt-br');

export default function ProfProfile() {
    const { id } = useParams()
    const [prof, setProf] = React.useState(null);
    const [modulos, setModulos] = React.useState([]);
    const [expandedAccordion, setExpandedAccordion] = React.useState(null)

    React.useEffect(() => {
        fetchProf();
        fetchModulos();
    }, []);

    const fetchProf = async () => {
        try {
            const profId = id;
            const result = await myfetch.get(`/professores/${profId}`);
            setProf(result);
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    const fetchModulos = async () => {
        try {
            const profId = id;
            const result = await myfetch.get(`/modulos/professor/${profId}`);
            setModulos(result);
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
                    {prof && (
                        <>
                            <Avatar alt={prof.user.nome} src={prof.imageUrl} sx={{ width: 56, height: 56 }} />
                            <Typography variant="h4">{prof.user.nome}</Typography>
                            <Typography variant="h6">{prof.especialidade} </Typography>
                            {/*<Typography variant="body1">{prof.data_nasc}</Typography>*/}
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
                            <Box display="flex" sx={{ margin: "10px" }}>
                                <Button component={Link} to={`/prof/${prof.id}/disponib`} variant="contained" sx={{ backgroundColor: "#9d2f2e" }}> Ajustar Disponibilidade </Button>
                            </Box>
                        </>
                    )}
                    <Divider />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5">Módulos</Typography>
                    </Box>
                    {modulos.map((modulo, index) => (
                        <Accordion key={index} expanded={expandedAccordion === index} onChange={() => handleAccordionChange(index)} sx={{ width: '100%' }}>
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