import React from 'react';
import myfetch from '../utils/myfetch'
import { Link, useParams } from 'react-router-dom'

import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Accordion, AccordionSummary, AccordionDetails, Avatar, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, AccordionActions, Stack, Link as MuiLink } from '@mui/material';
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

import theme from '../utils/theme';
import moment from 'moment';

moment.locale('pt-br');

export default function AlunoProfile() {
    const { id } = useParams()
    const [aluno, setAluno] = React.useState(null)
    const [idade, setIdade] = React.useState(null)

    React.useEffect(() =>{
        if (aluno) {
            const today = moment()
            const alunoIdade = today.diff(aluno.data_nasc, 'years')
            setIdade(parseInt(alunoIdade))
        }
    }, [aluno])

    React.useEffect(() => {
        fetchAluno();
    }, []);

    const fetchAluno = async () => {
        try {
            const alunoId = id;
            const result = await myfetch.get(`/alunos/${alunoId}`);
            setAluno(result);
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline />
                {aluno && (
                    <>
                        <Typography variant="h4">{aluno.user.nome}</Typography>
                        <Typography variant="h6">{moment(aluno.data_nasc).format('LL')} ({idade} anos)</Typography>
                        <Divider />
                            <Box sx={{ margin: "25px" }}>
                                <Typography variant="body1" >
                                    Contatos:
                                    <Box sx={{ mt: 1 }}>
                                        <MdEmail /> <a href={`mailto:${aluno.user.email}`}>E-mail</a>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <FaWhatsapp /> <a href={`https://wa.me/${aluno.user.telefone}`}>WhatsApp</a>
                                    </Box>
                                </Typography>
                            </Box>
                    </>
                )}
            </Container>
        </ThemeProvider>
    )
}