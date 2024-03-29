import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Divider } from '@mui/material';
import myfetch from '../utils/myfetch';

export default function CreateTeacherForm() {
    const navigate = useNavigate();
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [telefone, setTelefone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [subjectTaught, setSubjectTaught] = React.useState('');
    const [profileImage, setProfileImage] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call your backend API to create a new user and a new teacher
            const response = await myfetch.post('/create-teacher', {
                nome,
                email,
                telefone,
                address,
                subjectTaught,
                profileImage
            });
            // Handle success
            console.log('Teacher created:', response);
        } catch (error) {
            // Handle error
            console.error('Error creating teacher:', error);
        }
    };

    return (
        <Container>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Cadastrar Novo Professor</Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <Typography>Nome do professor: </Typography>
                <TextField
                    name="nome"
                    label="Nome"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                <Divider />
                <Typography>E-mail de contato: </Typography>
                <TextField
                    name="email"
                    label="Email"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Divider />
                <Typography>Telefone de contato: </Typography>
                <TextField
                    name="telefone"
                    label="Telefone"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={telefone}
                    onChange={(e) => setTelephone(e.target.value)}
                    required
                />
                <Divider />
                <Typography>Endereço: </Typography>
                <TextField
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Divider />
                <Typography>Idiomas e matérias que leciona: </Typography>
                <TextField
                    name="idiomas e matérias"
                    label="Idiomas e matérias"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={subjectTaught}
                    onChange={(e) => setSubjectTaught(e.target.value)}
                    required
                />
                <Divider />
                <Typography>Foto: </Typography>
                <TextField
                    name="imagem"
                    label="URL da imagem"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                />
                <Box sx={{ padding: '10px' }}>
                    <Button type="submit" variant="contained" color="primary">Cadastrar Professor</Button>
                </Box>
                <Box sx={{ padding: '10px' }}>
                    <Button type="button" variant="outlined" onClick={() => navigate('/profs')}>Cancelar</Button>
                </Box>
            </form>
        </Container>
    );
}
