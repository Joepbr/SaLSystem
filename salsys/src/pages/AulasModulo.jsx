import React from 'react';
import myfetch from '../utils/myfetch';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Divider, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Box, List, ListItem, ListItemText } from '@mui/material';
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

    const formatHorario = (horario) => {
        return moment(horario).format('HH:mm')
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
                await myfetch.delete(`/aulas/${aulaToDelete.id}`);
                await myfetch.delete(`/presencas/aula/${aulaToDelete.id}`)
                setOpenDeleteDialog(false);
                setWaiting(false)
                fetchData();
            } catch (error) {
                console.error(error);
                alert('ERRO: ' + error.message);
            }
        }
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    return (
        <Container>
            <Waiting show={waiting} />
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
        </Container>
    )
}