import React from 'react';
import myfetch from '../utils/myfetch'
import { Link, useParams } from 'react-router-dom'

import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, FormControl, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

import theme from '../utils/theme';
import moment from 'moment';
import Waiting from '../ui/Waiting';


moment.locale('pt-br');

export default function AlunoProfile() {
    const { id } = useParams()
    const [aluno, setAluno] = React.useState(null)
    const [idade, setIdade] = React.useState(null)
    const [openEnrollDialog, setOpenEnrollDialog] = React.useState(false)
    const [selectedModulo, setSelectedModulo] = React.useState(null)
    const [availableModulos, setAvailableModulos] = React.useState([])
    const [matriculas, setMatriculas] = React.useState([])
    const [waiting, setWaiting] = React.useState(false)

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
            setWaiting(true)
            const alunoId = id;
            const result = await myfetch.get(`/alunos/${alunoId}`);
            setAluno(result);
            setWaiting(false)
            fetchModulos()
            fetchMatriculas()
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    const fetchModulos = async () => {
        try {
            setWaiting(true)
            const result = await myfetch.get('/modulos')
            setAvailableModulos(result)
            setWaiting(false)
        } catch (error) {
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    const fetchMatriculas = async () => {
        try {
            setWaiting(true)
            const result = await myfetch.get(`/matriculas/aluno/${id}`)
            setMatriculas(result)
            setWaiting(false)
        } catch (error) {
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    const handleEnrollClick = () => {
        setOpenEnrollDialog(true);
    };

    const handleEnrollConfirmation = async () => {
        if (selectedModulo) {
            try {
                setWaiting(true)
                await myfetch.post('/matriculas', {
                    alunoId: aluno.id,
                    moduloId: selectedModulo.id
                })
                setOpenEnrollDialog(false)
                setWaiting(false)

                await fetchAluno()
            } catch (error) {
                console.error(error)
                alert('ERRO: ' + error.message)
            }
        }
    }

    const handleDeleteConfirmation = (matriculaId) => {
        if(window.confirm('Tem certeza que deseja cancelar esta matrícula?')) {
            handleCancelMatricula(matriculaId)
        }
    }

    const handleCancelMatricula = async (matriculaId) => {
        try {
            setWaiting(true)
            await myfetch.delete(`/matriculas/${matriculaId}`)
            setWaiting(false)
            await fetchMatriculas()
        } catch (error) {
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline />
                <Waiting show={waiting} />
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
                        <Divider />
                        {aluno.resp_nome && (
                            <>
                            <Typography variant="h5">{aluno.resp_parent}: {aluno.resp_nome}</Typography>
                            <Typography variant="body1" >
                                Contatos:
                                <Box sx={{ mt: 1 }}>
                                    <MdEmail /> <a href={`mailto:${aluno.resp_email}`}>E-mail</a>
                                </Box>
                                <Box sx={{ mt: 1, mb: 1 }}>
                                    <FaWhatsapp /> <a href={`https://wa.me/${aluno.resp_telefone}`}>WhatsApp</a>
                                </Box>
                            </Typography>
                            <Divider />
                            </>
                        )}
                        <Button onClick={handleEnrollClick} variant="contained" color="secondary" sx={{margin: '25px'}}>Matricular Aluno</Button>
                        <Dialog open={openEnrollDialog} onClose={() => setOpenEnrollDialog(false)}>
                            <DialogTitle>Matricular em um módulo</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Selecione o módulo no qual deseja matricular o aluno:
                                </DialogContentText>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedModulo}
                                        onChange={(e) => setSelectedModulo(e.target.value)}
                                    >
                                        {availableModulos.map(modulo => (
                                            <MenuItem key={modulo.id} value={modulo}>
                                                <ListItemIcon>
                                                    <Avatar alt={modulo.curso.nome} src={modulo.curso.imageUrl} sx={{ width: 24, height: 24 }} />
                                                </ListItemIcon>
                                                <ListItemText>{modulo.titulo}</ListItemText>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleEnrollConfirmation} color="primary">Matricular</Button>
                                <Button onClick={() => setOpenEnrollDialog(false)} color="secondary">Cancelar</Button>
                            </DialogActions>
                        </Dialog>

                        {matriculas.length > 0 && (
                            <>
                                <Typography variant="h5">Módulos Matriculados:</Typography>
                                {matriculas.map(matricula => (
                                    <Box key={matricula.id}>
                                        <Typography>{matricula.modulo.titulo}</Typography>
                                        <Button onClick={() => handleDeleteConfirmation(matricula.id)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Deletar</Button>
                                    </Box>
                                ))}
                                <Divider />
                            </>
                        )}
                    </>
                )}
            </Container>
        </ThemeProvider>
    )
}