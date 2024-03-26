import React from 'react'
import myfetch from '../utils/myfetch'

import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Accordion, AccordionSummary, AccordionDetails, Avatar, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, AccordionActions, Stack, Link as MuiLink } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Link, useParams } from 'react-router-dom'
import theme from '../utils/theme';


export default function ProfProfile() {
    const { id } = useParams()
    const [prof, setProf] = React.useState(null);
    const [modulos, setModulos] = React.useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [moduloToDelete, setmoduloToDelete] = React.useState(null);

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
            <Avatar alt={prof.user.nome} src={prof.imageUrl} sx={{ width: 56, height: 56 }} />
            <h2>Profile Page of Prof with ID: {id}</h2>
        </Container>
    )
}