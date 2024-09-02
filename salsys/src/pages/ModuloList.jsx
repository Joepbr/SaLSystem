import React, { useContext } from 'react';
import myfetch from '../utils/myfetch';
import AuthUserContext from '../contexts/AuthUserContext';
import { Link, useParams } from 'react-router-dom';
import { Box, Container, Typography, Divider, Button, Accordion, AccordionSummary, AccordionDetails, AccordionActions, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Link as MuiLink, Stack } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaGraduationCap } from "react-icons/fa6";

import moment from 'moment';
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

export default function Modulos() {
    const { authUser } = useContext(AuthUserContext)
    const { id } = useParams()
    const [curso, setCurso] = React.useState(null);
    const [modulos, setModulos] = React.useState([]);
    const [expandedAccordion, setExpandedAccordion] = React.useState(null)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [moduloToDelete, setmoduloToDelete] = React.useState(null);
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchCurso();
        fetchModulos();
    }, []);

    const fetchCurso = async () => {
        try {
            setWaiting(true)
            const cursoId = id;
            const result = await myfetch.get(`/cursos/${cursoId}`);
            setCurso(result);
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    };

    const fetchModulos = async () => {
        try {
            setWaiting(true)
            const cursoId = id;
            const result = await myfetch.get(`/modulos/curso/${cursoId}`);
            const activeModulos = result.filter(modulo => modulo.active)
            setModulos(activeModulos);
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
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

    const handleDeleteConfirmation = (modulo) => {
        setmoduloToDelete(modulo);
        setOpenDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (moduloToDelete) {
            try {
                setWaiting(true)
                await myfetch.delete(`/modulos/${moduloToDelete.id}`);
                
                setOpenDeleteDialog(false);
                setWaiting(false)
            } catch (error) {
                console.error(error);
                alert('ERRO: ' + error.message);
                setWaiting(false)
            }
        }
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <Container>
            <Waiting show={waiting} />
            <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                <Avatar alt={curso ? curso.nome : 'Carregando...'} src={curso? curso.imageUrl : 'X' } sx={{ width: 56, height: 56 }}>X</Avatar>
                <Typography variant="h4">{curso ? curso.nome : 'Carregando...'}</Typography>
            </Stack>
            <Divider />
            <Typography variant="h6">{curso ? curso.descricao : 'Carregando...'}</Typography>
            <Typography variant="body1">{curso ? curso.detalhes : 'Carregando...'}</Typography>
            <Divider />
            <Typography variant="h5">Módulos:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 2, marginBottom: 2}}>
            {modulos.map((modulo, index) => (
                <Accordion key={index} expanded={expandedAccordion === index} onChange={() => handleAccordionChange(index)} sx={{ width: '100%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    {expandedAccordion === index ? (
                        <MuiLink component={Link} to={`/modulo/${modulo.id}`} underline="none" color="inherit" style={{ width: '100%' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography sx={{ ml: 2 }} variant="h5">{modulo.titulo}</Typography>
                        </Stack>
                        </MuiLink> 
                    ) : (
                        <>
                            <Typography sx={{ ml: 2 }} variant="h5">{modulo.titulo}</Typography>
                        </>
                    )}
                    </AccordionSummary>
                    <AccordionDetails sx={{ flexDirection: 'column', padding: 1, marginLeft: 5 }}>
                        <Typography>{`Dias de aula: ${formatDiasSem(modulo.dias_sem)}, Horário: ${formatHorario(modulo.horario)}`}</Typography>
                        <Typography>{`Professor: ${modulo.professor && modulo.professor.user && modulo.professor.user.nome ? modulo.professor.user.nome : 'Nome do professor não disponível'}`}</Typography>
                    </AccordionDetails>
                    {authUser?.is_admin && (
                        <AccordionActions>
                            <Button component={Link} to={`/modulo/${modulo.id}/edit`} variant="outlined" size="small" startIcon={<EditIcon />}>Editar</Button>
                            <Button onClick={(event) => handleDeleteConfirmation(modulo, event)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Deletar</Button>
                        </AccordionActions>
                    )}
                </Accordion>
            ))}
            </Box>
            {authUser?.is_admin && (
                <Button 
                    component={Link} 
                    to={`/curso/${id}/modulos/new`} 
                    variant="contained" 
                    color="primary"
                    size="large"
                    startIcon={<FaGraduationCap/>}
                >
                    Novo Módulo
                </Button>
            )}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete modulo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que você deseja deletar o módulo "{moduloToDelete ? moduloToDelete.titulo : ''}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} variant="contained" color="secondary" autoFocus>
                        Deletar
                    </Button>
                    <Button onClick={handleCloseDeleteDialog} variant="contained" color="primary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}