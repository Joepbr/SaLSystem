import React, { useContext } from 'react';
import AuthUserContext from '../contexts/AuthUserContext';
import { Link } from 'react-router-dom';
import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { PiStudentFill } from "react-icons/pi";
import theme from '../utils/theme';
import myfetch from '../utils/myfetch';
import Waiting from '../ui/Waiting';

export default function Alunos() {
    const { authUser } = useContext(AuthUserContext)
    const [alunos, setAlunos] = React.useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [alunoToDelete, setAlunoToDelete] = React.useState(null);
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
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
                                        {authUser?.is_admin && (
                                            <Box>
                                                <Button component={Link} to={`/aluno/${aluno.id}/edit`} variant="outlined" size="small" startIcon={<EditIcon />} sx={{ mr: 2 }}>Editar</Button>
                                                <Button onClick={(event) => handleDeleteConfirmation(aluno, event)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Deletar</Button>
                                            </Box>
                                        )}
                                        <Divider component="li" />
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                    <Box display="flex">
                        {authUser?.is_admin && (
                            <Button 
                                component={Link} 
                                to="/alunos/new" 
                                variant="contained" 
                                size="large"
                                sx={{ backgroundColor: "#9d2f2e" }}
                                startIcon={<PiStudentFill />}
                            > 
                                Novo Aluno 
                            </Button>
                        )}
                    </Box>
                    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                        <DialogTitle>Remover Aluno</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Tem certeza que você deseja remover o(a) aluno(a) "{alunoToDelete ? alunoToDelete.user.nome : ''}"?
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