import React from 'react'
import myfetch from '../utils/myfetch'

import { Button, CssBaseline, Box, Typography, Container, ThemeProvider, Divider, Card, CardContent, CardActionArea, CardMedia, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom'
import theme from '../utils/theme';
import Waiting from '../ui/Waiting';


export default function Cursos(){
    const [cursos, setCursos] = React.useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [cursoToDelete, setCursoToDelete] = React.useState(null)
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setWaiting(true)
            const result = await myfetch.get('/cursos')
            result.sort((a, b) => a.id - b.id)
            setCursos(result)
            setWaiting(false)
        }
        catch(error) {
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    const handleDeleteConfirmation = (cursos, event) => {
        if (event) {
            event.preventDefault()
        }
        setCursoToDelete(cursos)
        setOpenDeleteDialog(true)
    }

    const handleDelete = async () => {
        if (cursoToDelete) {
            try {
                setWaiting(true)
                await myfetch.delete(`/cursos/${cursoToDelete.id}`);
                setOpenDeleteDialog(false)
                setWaiting(false)
            } catch (error) {
                console.error(error)
                alert('ERRO: '+ error.message)
            }
        }
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline>
                    <Waiting show={waiting} />
                    <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                        Cursos oferecidos pela Escola:
                    </Typography>
                    <Divider />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', }}>
                        {cursos.map((curso, index) => (
                            <Card key={index} sx={{ minWidth: 275, margin: 2, backgroundColor: "white" }}>
                                <Link to={`/curso/${curso.id}`} style={{textDecoration: 'none'}}>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            height= "140"
                                            image={curso.imageUrl}
                                            alt={curso.nome}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div" sx={{ color: "black" }} >
                                                {curso.nome}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb:1.5, color: "black" }} >
                                                {curso.descricao}
                                            </Typography>
                                            <Box display="flex" justifyContent="space-between">
                                                <Button component={Link} to={`/curso/${curso.id}/edit`} variant="outlined" size="small" startIcon={<EditIcon />}>Editar</Button>
                                                <Button onClick={(event) => handleDeleteConfirmation(curso, event)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Deletar</Button>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Link>
                            </Card>
                        ))}
                    <Divider />
                    </Box>
                    <Box display="flex">
                        <Button component={Link} to="/cursos/new" variant="contained" sx={{ backgroundColor: "#9d2f2e" }}> Criar Novo Curso </Button>
                    </Box>
                    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                        <DialogTitle>Deletar Curso</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Tem certeza que você deseja deletar o curso "{cursoToDelete ? cursoToDelete.nome : ''}"?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDelete} sx={{backgroundColor: "#9d2f2e", color: "white"}}>
                                Deletar
                            </Button>
                            <Button onClick={handleCloseDeleteDialog} sx={{backgroundColor: "#25254b", color: "white"}}>
                                Cancelar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </CssBaseline>
            </Container>
        </ThemeProvider>
    )
}