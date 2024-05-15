import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Divider } from '@mui/material';
import myfetch from '../utils/myfetch';
import Waiting from '../ui/Waiting';

export default function EditarCursoForm() {
    const [cursoData, setCursoData] = React.useState({ nome: '', descricao: '', detalhes: '', imageUrl: '' });
    const [imageFile, setImageFile] = React.useState(null)
    const navigate = useNavigate();
    const { id } = useParams()
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchCursoData();
    }, [id]);

    const fetchCursoData = async () => {
        try {
            setWaiting(true)
            const result = await myfetch.get(`/cursos/${id}`);
            setCursoData(result);
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCursoData({ ...cursoData, [name]: value });
    };

    const handleFileChange = async (e) => {
        setImageFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setWaiting(true)

            let imageUrl = cursoData.imageUrl
            if (imageFile) {
                const formData = new FormData()
                formData.append('image', imageFile)

                const response =await myfetch.post('/api/upload', formData)
                imageUrl = response.imageUrl
            }

            await myfetch.put(`/cursos/${id}`, { ...cursoData, imageUrl });
            setWaiting(false)
            navigate('/cursos');
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    };

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Editar Curso</Typography>
            <Divider/>
            <form onSubmit={handleSubmit}>
                <Typography>Nome do curso</Typography>
                <TextField
                    name="nome"
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
                    type="file"
                    name="image"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    onChange={handleFileChange}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>Confirmar</Button>
                <Button type="button" variant="outlined" onClick={() => navigate('/cursos')}>Cancelar</Button>
            </form>
        </Container>
    );
}