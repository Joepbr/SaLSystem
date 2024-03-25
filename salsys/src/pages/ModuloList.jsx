import React from 'react';
import myfetch from '../utils/myfetch';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Divider, Button, Accordion, AccordionSummary, AccordionDetails, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Modulos() {
    const { id } = useParams()
    const [curso, setCurso] = React.useState(null);
    const [modulos, setModulos] = React.useState([]);
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
            <Avatar alt={curso ? curso.nome : 'Loading...'} src={curso? curso.imageUrl : 'X'}>X</Avatar>
            <Typography variant="h4">{curso ? curso.nome : 'Loading...'}</Typography>
            <Divider />
            <Typography variant="h6">{curso ? curso.descricao : 'Loading...'}</Typography>
            <Typography variant="body1">{curso ? curso.detalhes : 'Loading...'}</Typography>
            <Divider />
            <Typography variant="h5">Módulos</Typography>
            {modulos.map((modulo, index) => (
                <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{modulo.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{`Weekday: ${modulo.weekday}, Hour: ${modulo.hour}`}</Typography>
                        <IconButton component={Link} to={`/modulo/${modulo.id}`} aria-label="View modulo">
                            View
                        </IconButton>
                        <IconButton component={Link} to={`/modulo/${modulo.id}/edit`} aria-label="Edit modulo">
                            Edit
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmation(modulo)} aria-label="Delete modulo">
                            Delete
                        </IconButton>
                    </AccordionDetails>
                </Accordion>
            ))}
            <Button component={Link} to={`/curso/${id}/modulos/new`} variant="contained" color="primary">Criar Novo Módulo</Button>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete modulo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the modulo "{moduloToDelete ? moduloToDelete.title : ''}"?
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