import React, { useState, useEffect } from 'react'
import myfetch from '../utils/myfetch'

import { Button, CssBaseline, Box, Typography, Container, ThemeProvider, Divider, Card, CardContent, CardActionArea, CardMedia, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom'
import theme from '../utils/theme';


export default function Cursos(){
    const [cursos, setCursos] = useState([])
    const [openDeleteDialog, setOpenDeleteDialog] =useState(false)
    const [cursoToDelete, setCursoToDelete] = useState(null)

    //useEffect com vetor de dependências vazio é executado apenas uma vez,
    //na fase mount do ciclo de vida do componente
    React.useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const result = await myfetch.get('/cursos')
            setCursos(result)
        }
        catch(error) {
            //deu errado
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    const handleDeleteConfirmation = (cursos) => {
        setCursoToDelete(cursos)
        setOpenDeleteDialog(true)
    }

    const handleDelete = async () => {
        if (cursoToDelete) {
            try {
                // Make delete request
                // await myfetch.delete(`/cursos/${courseToDelete.id}`);

                // For demo, removing the course directly from the state
                setCursos(cursos.filter(course => course.id !== cursoToDelete.id))
                setOpenDeleteDialog(false)
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
                    <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                        Cursos oferecidos pela Escola:
                    </Typography>
                    <Divider />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', }}>
                        {cursos.map((curso, index) => (
                            <Card key={index} sx={{ minWidth: 275, margin: 2, backgroundColor: "white", color: "black" }}>
                                <CardActionArea component={Link} to={`/curso/${curso.id}`} style={{textDecoration: 'none'}}>
                                    <CardMedia
                                        component="img"
                                        height= "140"
                                        image={curso.imageUrl}
                                        alt={curso.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {curso.nome}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb:1.5 }} >
                                            {curso.descricao}
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between">
                                            <Button component={Link} to={`/curso/${curso.id}/edit`} variant="outlined" size="small" startIcon={<EditIcon />}>Editar</Button>
                                            <Button onClick={() => handleDeleteConfirmation(curso)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Deletar</Button>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
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
                                Tem certeza que você deseja deletar o curso "{cursoToDelete ? cursoToDelete.title : ''}"?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteDialog} sx={{backgroundColor: "#25254b"}}>
                                Cancelar
                            </Button>
                            <Button onClick={handleDelete} sx={{backgroundColor: "#9d2f2e"}}>
                                Deletar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </CssBaseline>
            </Container>
        </ThemeProvider>
    )
}