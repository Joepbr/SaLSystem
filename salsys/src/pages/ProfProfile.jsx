import React from 'react'
import myfetch from '../utils/myfetch'

import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Accordion, AccordionSummary, AccordionDetails, Avatar, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, AccordionActions, Stack, Link as MuiLink } from '@mui/material';
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";


import { Link, useParams } from 'react-router-dom'
import theme from '../utils/theme';


export default function ProfProfile() {
    const { id } = useParams()
    const [prof, setProf] = React.useState(null);
    const [modulos, setModulos] = React.useState([]);

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

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline>
                    {prof && (
                        <>
                            <Avatar alt={prof.user.nome} src={prof.imageUrl} sx={{ width: 56, height: 56 }} />
                            <Typography variant="h4">{prof.user.nome}</Typography>
                            <Typography variant="h6">{prof.especialidade}</Typography>
                            <Divider />
                            <Box sx={{ margin: "25px" }}>
                                <Typography variant="body1" >
                                    Contatos:
                                    <Box>
                                        <MdEmail /> <a href={`mailto:${prof.user.email}`}>E-mail</a>
                                    </Box>
                                    <Box>
                                        <FaWhatsapp /> <a href={`https://wa.me/${prof.user.telefone}`}>WhatsApp</a>
                                    </Box>
                                </Typography>
                            </Box>
                        </>
                    )}
                    <Divider />
                    <Typography variant="h5">Módulos</Typography>
                    {modulos.map((modulo, index) => (
                        <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{modulo.titulo}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{`Dias de aula: ${modulo.dias_sem}, Horário: ${modulo.horario}`}</Typography>
                                <IconButton component={Link} to={`/modulo/${modulo.id}`} aria-label="View modulo">
                                    View
                                </IconButton>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </CssBaseline>
            </Container>
        </ThemeProvider>
    )
}