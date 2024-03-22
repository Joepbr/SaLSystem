import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom'
import myfetch from '../utils/myfetch';

export default function NovoCursoForm() {
    const [cursoData, setCursoData] = useState({ nome: '', descricao: '', detalhes: '', imageUrl: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCursoData({ ...cursoData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make post request
            await myfetch.post('/cursos', cursoData);

            // For demo, log the course data and redirect to previous page
            console.log('Course data:', cursoData);
            navigate.goBack();
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    return (
        <Container>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Criar Novo Curso</Typography>
            <Divider/>
            <form onSubmit={handleSubmit}>
                <Typography>Nome do curso</Typography>
                <TextField
                    name="nome"
                    label="Nome"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={cursoData.nome}
                    onChange={handleChange}
                    required
                />
                <Divider/>
                <Typography>Breve descrição</Typography>
                <TextField
                    name="descricao"
                    label="Descrição"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    multiline
                    rows={2}
                    value={cursoData.descricao}
                    onChange={handleChange}
                    required
                />
                <Divider/>
                <Typography>Descrição Detalhada</Typography>
                <TextField
                    name="detalhes"
                    label="Detalhes"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    multiline
                    rows={4}
                    value={cursoData.detalhes}
                    onChange={handleChange}
                    required
                />
                <Divider/>
                <Typography>Imagem ilustrativa</Typography>
                <TextField
                    name="imageUrl"
                    label="URL da imagem"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={cursoData.imageUrl}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>Create</Button>
                <Button type="button" variant="outlined" component={Link} to="/cursos">Cancel</Button>
            </form>
        </Container>
    );
}