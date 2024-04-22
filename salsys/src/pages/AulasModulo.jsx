import React from 'react';
import myfetch from '../utils/myfetch';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Box, List, ListItem, ListItemText, Stack, Switch, FormControlLabel } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { FaBook } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import moment from 'moment';
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

export default function AulasModulo() {
    const { id } = useParams()
    const [modulo, setModulo] = React.useState(null);
    const [aulas, setAulas] = React.useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [aulaToDelete, setAulaToDelete] = React.useState(null);
    const [openDeactivateDialog, setOpenDeactivateDialog] = React.useState(false);
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchModulo();
        fetchAulas()
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
        }
    }

    const formatDiasSem = (diasSem) => {
        const formatedDias = diasSem.map(dia => dia.dia).join(', ')
        return formatedDias.replace(/,\s*$/, '')
    }

    const handleDeleteConfirmation = (aula, event) => {
        event.preventDefault();
        setAulaToDelete(aula);
        setOpenDeleteDialog(true);
    }

    const handleDelete = async () => {
        if (aulaToDelete) {
            try {
                setWaiting(true)
                await myfetch.delete(`/presencas/aula/${aulaToDelete.id}`)
                await myfetch.delete(`/aulas/${aulaToDelete.id}`);
                setOpenDeleteDialog(false);
                setWaiting(false)
                fetchAulas();
            } catch (error) {
                console.error(error);
                alert('ERRO: ' + error.message);
            }
        }
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
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
                    {modulo && (
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
            <Typography variant='h6'>Aulas Registradas no Sistema:</Typography>
            <List>
                {aulas.map((aula, index) => (
                    <React.Fragment key={aula.id}>
                        <ListItem
                            button
                            component={Link}
                            to={`/aula/${aula.id}`}
                            sx={{ borderBottom: index < aulas.length - 1 ? '1px solid #ccc' : 'none' }}
                        >
                            <ListItemText
                                primary={moment(aula.data).format('L')}
                                primaryTypographyProps={{
                                    fontSize: 20,
                                    fontWeight: 'medium'
                                }}
                                secondary={aula.conteudo}
                            />
                            <Button onClick={(event) => handleDeleteConfirmation(aula, event)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Deletar Registro de Aula</Button>
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Remover Registro de Aula</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que você deseja remover o registro da aula "{aulaToDelete ? moment(aulaToDelete.data).format('L') : ''}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} sx={{ backgroundColor: "#9d2f2e", color: "white" }}>
                        Deletar
                    </Button>
                    <Button onClick={handleCloseDeleteDialog} sx={{ backgroundColor: "#25254b", color: "white" }}>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeactivateDialog} onClose={closeDeactivationDialog}>
                <DialogTitle>Desativar Módulo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja desativar este módulo?
                    </DialogContentText>
                </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDeactivationDialog} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleModuloDeactivation} color="secondary">
                            Desativar
                        </Button>
                    </DialogActions>
            </Dialog>
        </Container>
    )
}