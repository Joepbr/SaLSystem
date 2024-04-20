import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import theme from '../utils/theme';
import myfetch from '../utils/myfetch';
import Waiting from '../ui/Waiting';

export default function Alunos() {
    const [alunos, setAlunos] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [alunoToDelete, setAlunoToDelete] = useState(null);
    const [waiting, setWaiting] = React.useState(false)

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setWaiting(true)
            const result = await myfetch.get('/alunos');
            result.sort((a, b) => a.user.nome.localeCompare(b.user.nome))
            setAlunos(result);
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    }

    const handleDeleteConfirmation = (aluno, event) => {
        event.preventDefault();
        setAlunoToDelete(aluno);
        setOpenDeleteDialog(true);
    }

    const handleDelete = async () => {
        if (alunoToDelete) {
            try {
                setWaiting(true)
                await myfetch.delete(`/alunos/${alunoToDelete.id}`);
                await myfetch.delete(`/users/${alunoToDelete.id}`)
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
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline>
                    <Waiting show={waiting} />
                    <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                        Lista de Alunos da Escola:
                    </Typography>
                    <Divider sx={{ mb: 2 }}/>
                    <Box sx={{ marginTop: 2, marginBottom: 2, backgroundColor: "white", borderRadius: '5px' }}>
                        <List>
                            {alunos.map((aluno, index) => (
                                <React.Fragment key={aluno.id}>
                                    <ListItem 
                                        button
                                        component={Link}
                                        to={`/aluno/${aluno.id}`}
                                        sx={{ borderBottom: index < alunos.length - 1 ? '1px solid #ccc' : 'none' }}
                                    >
                                        <ListItemText 
                                            primary={aluno.user.nome} 
                                            primaryTypographyProps={{
                                                fontSize: 20,
                                                fontWeight: 'medium'
                                            }}
                                        />
                                        <Button component={Link} to={`/aluno/${aluno.id}/edit`} variant="outlined" size="small" startIcon={<EditIcon />} sx={{ mr: 2 }}>Editar</Button>
                                        <Button onClick={(event) => handleDeleteConfirmation(aluno, event)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Deletar</Button>
                                        <Divider component="li" />
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                    <Box display="flex">
                        <Button component={Link} to="/alunos/new" variant="contained" sx={{ backgroundColor: "#9d2f2e" }}> Cadastrar Novo Aluno </Button>
                    </Box>
                    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                        <DialogTitle>Remover Aluno</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Tem certeza que você deseja remover o aluno "{alunoToDelete ? alunoToDelete.user.nome : ''}"?
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
                </CssBaseline>
            </Container>
        </ThemeProvider>
    )
}