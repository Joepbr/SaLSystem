import React from 'react';
import myfetch from '../utils/myfetch';
import { Link, useParams } from 'react-router-dom';
import { Box, Container, Typography, Divider, Button, Accordion, AccordionSummary, AccordionDetails, AccordionActions, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Link as MuiLink, Stack } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';

moment.locale('pt-br');

export default function Modulos() {
    const { id } = useParams()
    const [curso, setCurso] = React.useState(null);
    const [modulos, setModulos] = React.useState([]);
    const [expandedAccordion, setExpandedAccordion] = React.useState(null)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [moduloToDelete, setmoduloToDelete] = React.useState(null);

    React.useEffect(() => {
        fetchCurso();
        fetchModulos();
    }, []);

    const fetchCurso = async () => {
        try {
            const cursoId = id;
            const result = await myfetch.get(`/cursos/${cursoId}`);
            setCurso(result);
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    const fetchModulos = async () => {
        try {
            const cursoId = id;
            const result = await myfetch.get(`/modulos/curso/${cursoId}`);
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

    const handleDeleteConfirmation = (modulo) => {
        setmoduloToDelete(modulo);
        setOpenDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (moduloToDelete) {
            try {
                // Make delete request
                // await myfetch.delete(`/modulos/${moduloToDelete.id}`);

                // For demo, removing the modulo directly from the state
                setModulos(modulos.filter(modulo => modulo.id !== moduloToDelete.id));
                setOpenDeleteDialog(false);
            } catch (error) {
                console.error(error);
                alert('ERRO: ' + error.message);
            }
        }
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <Container>
            <Avatar alt={curso ? curso.nome : 'Carregando...'} src={curso? curso.imageUrl : 'X'}>X</Avatar>
            <Typography variant="h4">{curso ? curso.nome : 'Carregando...'}</Typography>
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
                    <AccordionActions>
                        <Button component={Link} to={`/modulo/${modulo.id}/edit`} variant="outlined" size="small" startIcon={<EditIcon />}>Editar</Button>
                        <Button onClick={(event) => handleDeleteConfirmation(modulo, event)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Deletar</Button>
                    </AccordionActions>
                </Accordion>
            ))}
            </Box>
            <Button component={Link} to={`/curso/${id}/modulos/new`} variant="contained" color="primary">Criar Novo Módulo</Button>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete modulo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the modulo "{moduloToDelete ? moduloToDelete.titulo : ''}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}