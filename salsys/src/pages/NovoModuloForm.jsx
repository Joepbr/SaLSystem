import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Divider } from '@mui/material';
import myfetch from '../utils/myfetch';

export default function NovoModuloForm() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            navigate('/cursos')
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    return (
        <Container>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Criar Novo Módulo</Typography>
            <Divider/>
            <form onSubmit={handleSubmit}>
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>Criar</Button>
                <Button type="button" variant="outlined" onClick={() => navigate('/cursos')}>Cancelar</Button>
            </form>
        </Container>
    );
}