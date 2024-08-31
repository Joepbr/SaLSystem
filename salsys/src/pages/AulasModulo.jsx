import React, { useContext } from 'react';
import myfetch from '../utils/myfetch';
import AuthUserContext from '../contexts/AuthUserContext';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Box, List, ListItem, ListItemText, Stack, Switch, FormControlLabel, Link as MuiLink } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { FaBook } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdAssignment } from "react-icons/md";

import moment from 'moment';
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

export default function AulasModulo() {
    const { authUser } = useContext(AuthUserContext)
    const { id } = useParams()
    const [modulo, setModulo] = React.useState(null);
    const [aulas, setAulas] = React.useState([]);
    const [avaliacoes, setAvaliacoes] = React.useState([])
    const [openDeleteAulaDialog, setOpenDeleteAulaDialog] = React.useState(false);
    const [aulaToDelete, setAulaToDelete] = React.useState(null);
    const [openDeleteAvaliacaoDialog, setOpenDeleteAvaliacaoDialog] = React.useState(false);
    const [avaliacaoToDelete, setAvaliacaoToDelete] = React.useState(null);
    const [openDeactivateDialog, setOpenDeactivateDialog] = React.useState(false);
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchModulo();
        fetchAulas()
        fetchAvaliacoes()
    }, []);

    const fetchModulo = async () => {
        try {
            setWaiting(true)
            const moduloId = id;
            const result = await myfetch.get(`/modulos/${moduloId}`);
            setModulo(result);
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    };

    const fetchAulas = async () => {
    try {
        setWaiting(true)
        const moduloId = id
        const result = await myfetch.get(`/aulas/modulo/${moduloId}`)
        result.sort((a, b) => new Date(b.data) - new Date(a.data))
        setAulas(result)
        setWaiting(false)
    } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    }

    const fetchAvaliacoes = async () => {
        try {
            setWaiting(true)
            const moduloId = id
            const result = await myfetch.get(`/avaliacoes/modulo/${moduloId}`)
            result.sort((a, b) => new Date(b.data) - new Date(a.data))
            setAvaliacoes(result)
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    }

    const formatDiasSem = (diasSem) => {
        const formatedDias = diasSem.map(dia => dia.dia).join(', ')
        return formatedDias.replace(/,\s*$/, '')
    }

    const handleDeleteConfirmation = (aula, event) => {
        event.preventDefault();
        setAulaToDelete(aula);
        setOpenDeleteAulaDialog(true);
    }

    const handleDeleteAula = async () => {
        if (aulaToDelete) {
            try {
                setWaiting(true)
                await myfetch.delete(`/presencas/aula/${aulaToDelete.id}`)
                await myfetch.delete(`/aulas/${aulaToDelete.id}`);
                setOpenDeleteAulaDialog(false);
                setWaiting(false)
                fetchAulas();
            } catch (error) {
                console.error(error);
                alert('ERRO: ' + error.message);
                setWaiting(false)
            }
        }
    }

    const handleCloseDeleteAulaDialog = () => {
        setOpenDeleteAulaDialog(false);
    }

    const handleDeleteAvaliacaoConfirmation = (avaliacao, event) => {
        event.preventDefault();
        setAvaliacaoToDelete(avaliacao);
        setOpenDeleteAvaliacaoDialog(true);
    }

    const handleDeleteAvaliacao = async () => {
        if (avaliacaoToDelete) {
            try {
                setWaiting(true)
                await myfetch.delete(`/notas/avaliacao/${avaliacaoToDelete.id}`)
                await myfetch.delete(`/avaliacoes/${avaliacaoToDelete.id}`);
                setOpenDeleteAvaliacaoDialog(false);
                fetchAvaliacoes();
                setWaiting(false)
            } catch (error) {
                console.error(error);
                alert('ERRO: ' + error.message);
                setWaiting(false)
            }
        }
    }

    const handleCloseDeleteAvaliacaoDialog = () => {
        setOpenDeleteAvaliacaoDialog(false);
    }

    const openDeactivationDialog = () => {
        setOpenDeactivateDialog(true);
    };
    
    const handleModuloDeactivation = async () => {
        try {
            setWaiting(true)

            const isActive = modulo.active
            const updatedActive = isActive ? !modulo.active : true

            const updatedModuloData = {
                active: updatedActive,
                dias_sem: modulo.dias_sem.map(dia => dia.dia) 
            }
            delete updatedModuloData.id
            
            await myfetch.put(`/modulos/${modulo.id}`, updatedModuloData)
            
            const updatedModulo = { ...modulo, ...updatedModuloData }
            setModulo(updatedModulo)
            setOpenDeactivateDialog(false)
            setWaiting(false)
        } catch (error) {
            console.error(error)
            alert('ERRO: ' + error.message)
            setWaiting(false)
        }
    }

    const closeDeactivationDialog = () => {
        setOpenDeactivateDialog(false);
    };

    return (
        <Container>
            <Waiting show={waiting} />
            <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                <Avatar alt={modulo ? modulo.curso.nome : 'Carregando...'} src={modulo ? modulo.curso.imageUrl : 'Carregando...'} >X</Avatar>
                <Typography variant="h4">
                    {modulo ? modulo.titulo : 'Carregando...'}
                </Typography>
                    {modulo && authUser?.is_admin && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: '400px' }}>
                            <FormControlLabel
                                control={<Switch checked={modulo.active} onChange={openDeactivationDialog} />}
                                label={modulo.active ? "Ativo" : "Inativo"}
                            />
                        </Box>
                    )}
            </Stack>
            <Divider />
            <Typography variant="h6">{modulo ? 
                    <Box>
                        <Box>
                            Dias de aula: {formatDiasSem(modulo.dias_sem)}
                        </Box>
                        <Box>
                            Horário: {moment(modulo.horario).format('HH:mm') + ' (' + modulo.dur_aula + ' minutos)'}
                        </Box>
                        <Box>
                            Início das aulas: {moment(modulo.inicio).format('L')}
                        </Box>
                    </Box>
                : 'Carregando...'}
            </Typography>
            <Divider />
            {modulo && (
                <Typography variant="h6" sx={{ margin: 2 }}>Professor: <MuiLink component={Link} to={`/prof/${modulo.professor.id}`} underline="none" >{modulo.professor.user.nome}</MuiLink></Typography>
            )}
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
            {modulo && modulo.active && authUser?.professor && (
                <Box display="flex" sx={{ margin: 2 }}>
                    <Button 
                        component={Link} 
                        to={`/modulo/${id}/aula/new`} 
                        variant="contained" 
                        size="large"
                        sx={{ backgroundColor: "#9d2f2e", margin: 2 }}
                        startIcon={<GiTeacher/>}
                    > 
                        Nova Aula 
                    </Button>
                    <Button 
                        component={Link} 
                        to={`/modulo/${id}/avaliacao/new`} 
                        variant="contained" 
                        size="large"
                        sx={{ backgroundColor: "#25254b", margin: 2 }}
                        startIcon={<MdAssignment/>}
                    >
                        Nova Avaliação
                    </Button>
                </Box>
            )}
            {avaliacoes.length > 0 && (
                <>
                    <Typography variant='h6' sx={{ mt: 2, fontWeight: 'bold' }}>Lista de Avaliações:</Typography>
                    <List>
                        {avaliacoes.map((avaliacao, index) => (
                            <React.Fragment key={avaliacao.id}>
                                <ListItem
                                    button
                                    component={Link}
                                    to={`/avaliacao/${avaliacao.id}`}
                                    sx={{ borderBottom: index < aulas.length - 1 ? '1px solid #ccc' : 'none' }}
                                >
                                    <ListItemText
                                        primary={moment(avaliacao.data).format('L') + ' - ' + avaliacao.titulo}
                                        primaryTypographyProps={{
                                            fontSize: 20,
                                            fontWeight: 'medium'
                                        }}
                                    />
                                    {authUser?.professor && (
                                        <Box>
                                            <Button component={Link} to={`/avaliacao/${avaliacao.id}/edit`} variant="outlined" size="small" startIcon={<EditIcon />} sx={{ mr: 2 }}>Editar</Button>
                                            <Button onClick={(event) => handleDeleteAvaliacaoConfirmation(avaliacao, event)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Excluir</Button>
                                        </Box>
                                    )}
                                </ListItem>
                            </React.Fragment>
                        ))}
                    </List>
                    <Divider />
                </>
            )}
            <Typography variant='h6' sx={{ mt: 2, fontWeight: 'bold' }}>Lista de Aulas:</Typography>
            <List dense>
                {aulas.map((aula, index) => (
                    <React.Fragment key={aula.id}>
                        <ListItem
                            button
                            component={Link}
                            to={`/aula/${aula.id}`}
                            sx={{ borderBottom: index < aulas.length - 1 ? '1px solid #ccc' : 'none' }}
                        >
                            <ListItemText
                                primary={moment(aula.data).format('L') + ' - Aula ' + aula.num}
                                primaryTypographyProps={{
                                    fontSize: 20,
                                    fontWeight: 'medium'
                                }}
                                secondary={aula.conteudo}
                            />
                            {authUser?.professor && (
                                <Box>
                                    <Button component={Link} to={`/aula/${aula.id}/edit`} variant="outlined" size="small" startIcon={<EditIcon />} sx={{ mr: 2 }}>Editar</Button>
                                    <Button onClick={(event) => handleDeleteConfirmation(aula, event)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Excluir</Button>
                                </Box>
                            )}
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>
            <Dialog open={openDeleteAulaDialog} onClose={handleCloseDeleteAulaDialog}>
                <DialogTitle>Remover Registro de Aula</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que você deseja remover o registro da aula "{aulaToDelete ? moment(aulaToDelete.data).format('L') : ''}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteAula} variant="contained" color="secondary">
                        Exclir
                    </Button>
                    <Button onClick={handleCloseDeleteAulaDialog} variant="contained" color="primary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteAvaliacaoDialog} onClose={handleCloseDeleteAvaliacaoDialog}>
                <DialogTitle>Remover Registro de Avaliação</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que você deseja remover o registro da avaliação "{avaliacaoToDelete ? avaliacaoToDelete.titulo : ''}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteAvaliacao} variant="contained" color="secondary">
                        Excluir
                    </Button>
                    <Button onClick={handleCloseDeleteAvaliacaoDialog} variant="contained" color="primary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeactivateDialog} onClose={closeDeactivationDialog}>
                <DialogTitle>Desativar Módulo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja {modulo ? (modulo.active ? 'desativar' : 'reativar') : ''} este módulo?
                    </DialogContentText>
                </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModuloDeactivation} variant="contained" color="secondary">
                            {modulo ? (modulo.active ? 'Desativar' : 'Reativar') : ''}
                        </Button>
                        <Button onClick={closeDeactivationDialog} variant="contained" color="primary">
                            Cancelar
                        </Button>
                    </DialogActions>
            </Dialog>
        </Container>
    )
}