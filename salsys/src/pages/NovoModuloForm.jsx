import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import myfetch from '../utils/myfetch';

export default function NovoModuloForm() {
    const navigate = useNavigate();

    // State variables for form inputs
    const [titulo, setTitulo] = useState('');
    const [diasSem, setDiasSem] = useState('');
    const [horario, setHorario] = useState('');
    const [durAula, setDurAula] = useState('');
    const [inicio, setInicio] = useState('');
    const [durModulo, setDurModulo] = useState('');
    const [presencial, setPresencial] = useState(false);
    const [remoto, setRemoto] = useState(false);
    const [vip, setVip] = useState(false);
    const [preco, setPreco] = useState('');
    const [cursoId, setCursoId] = useState('');
    const [professorId, setProfessorId] = useState('');
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        // Fetch teachers from backend
        const fetchTeachers = async () => {
            try {
                const response = await myfetch('/teachers'); // Adjust the API endpoint accordingly
                setTeachers(response.data); // Assuming response.data is an array of teacher objects with 'id' and 'name'
            } catch (error) {
                console.error(error);
                // Handle error
            }
        };

        fetchTeachers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send form data to backend
            const formData = {
                titulo,
                dias_sem: diasSem,
                horario,
                dur_aula: parseInt(durAula),
                inicio,
                dur_modulo: parseInt(durModulo),
                presencial,
                remoto,
                vip,
                preco: parseFloat(preco),
                cursoId,
                professorId,
            };
            await myfetch('/modules', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' },
            });
            navigate('/cursos');
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    return (
        <Container>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Criar Novo Módulo</Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Dias da Semana"
                    value={diasSem}
                    onChange={(e) => setDiasSem(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Horário"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Duração da Aula (min)"
                    value={durAula}
                    onChange={(e) => setDurAula(e.target.value)}
                    type="number"
                    fullWidth
                    required
                />
                <TextField
                    label="Início"
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                    type="datetime-local"
                    fullWidth
                    required
                />
                <TextField
                    label="Duração do Módulo (semanas)"
                    value={durModulo}
                    onChange={(e) => setDurModulo(e.target.value)}
                    type="number"
                    fullWidth
                    required
                />
                <FormControl fullWidth>
                    <InputLabel>Professor</InputLabel>
                    <Select value={professorId} onChange={(e) => setProfessorId(e.target.value)} required>
                        {teachers.map((teacher) => (
                            <MenuItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={<Checkbox checked={presencial} onChange={(e) => setPresencial(e.target.checked)} />}
                    label="Presencial"
                />
                <FormControlLabel
                    control={<Checkbox checked={remoto} onChange={(e) => setRemoto(e.target.checked)} />}
                    label="Remoto"
                />
                <FormControlLabel
                    control={<Checkbox checked={vip} onChange={(e) => setVip(e.target.checked)} />}
                    label="VIP"
                />
                <TextField
                    label="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    type="number"
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                    Criar
                </Button>
                <Button type="button" variant="outlined" onClick={() => navigate('/cursos')}>
                    Cancelar
                </Button>
            </form>
        </Container>
    );
}