import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Divider } from '@mui/material';
import myfetch from '../utils/myfetch';

export default function EditarCursoForm() {
    const [cursoData, setCursoData] = React.useState({ nome: '', descricao: '', detalhes: '', imageUrl: '' });
    const navigate = useNavigate();
    const { id } = useParams()

    React.useEffect(() => {
        fetchCursoData();
    }, [id]);

    const fetchCursoData = async () => {
        try {
            const result = await myfetch.get(`/cursos/${id}`);
            setCursoData(result);
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCursoData({ ...cursoData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make put request
            await myfetch.put(`/cursos/${id}`, cursoData);
            navigate('/cursos');
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    return (
        <Container>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Editar Curso</Typography>
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
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>Confirmar</Button>
                <Button type="button" variant="outlined" onClick={() => navigate('/cursos')}>Cancelar</Button>
            </form>
        </Container>
    );
}