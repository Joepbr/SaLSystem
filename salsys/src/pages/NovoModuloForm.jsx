import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Divider, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import myfetch from '../utils/myfetch';

export default function NovoModuloForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [titulo, setTitulo] = React.useState('');
    const [diasSem, setDiasSem] = React.useState('');
    const [horario, setHorario] = React.useState('');
    const [durAula, setDurAula] = React.useState('');
    const [inicio, setInicio] = React.useState('');
    const [durModulo, setDurModulo] = React.useState('');
    const [presencial, setPresencial] = React.useState(false);
    const [remoto, setRemoto] = React.useState(false);
    const [vip, setVip] = React.useState(false);
    const [preco, setPreco] = React.useState('');
    const [cursoId, setCursoId] = React.useState(id);
    const [professorId, setProfessorId] = React.useState('');
    const [professores, setProfessores] = React.useState([]);

    React.useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const response = await myfetch.get('/professores');
                const professores = response.map(professor => ({
                    id: professor.id,
                    nome: professor.user.nome
                }))
                setProfessores(professores); 
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfessores();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
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
                <Typography>Título do Módulo:</Typography>
                <TextField
                    label="Título"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Dias de Aula na Semana:</Typography>
                <TextField
                    label="Dias da Semana"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={diasSem}
                    onChange={(e) => setDiasSem(e.target.value)}
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Horário das Aulas:</Typography>
                <TextField
                    label="Horário"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Tempo de Duração das Aulas:</Typography>
                <TextField
                    label="Duração da Aula (min)"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={durAula}
                    onChange={(e) => setDurAula(e.target.value)}
                    type="number"
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Dia de Início das Aulas:</Typography>
                <TextField
                    label="Início"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                    type="datetime-local"
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Tempo de Duração do Módulo:</Typography>
                <TextField
                    label="Duração do Módulo (semanas)"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={durModulo}
                    onChange={(e) => setDurModulo(e.target.value)}
                    type="number"
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Professor:</Typography>
                <FormControl fullWidth>
                    <InputLabel>Professor</InputLabel>
                    <Select 
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        value={professorId} 
                        onChange={(e) => setProfessorId(e.target.value)} 
                        required
                    >
                        {professores.map((professor) => (
                            <MenuItem key={professor.id} value={professor.id}>
                                {professor.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Divider />
                <Typography>Formato das aulas (presencal remoto ou híbrido)</Typography>
                <FormControlLabel
                    control={<Checkbox checked={presencial} onChange={(e) => setPresencial(e.target.checked)} />}
                    label="Presencial"
                />
                <FormControlLabel
                    control={<Checkbox checked={remoto} onChange={(e) => setRemoto(e.target.checked)} />}
                    label="Remoto"
                />
                <Divider />
                <Typography>Cheque esta opção se curso for VIP: </Typography>
                <FormControlLabel
                    control={<Checkbox checked={vip} onChange={(e) => setVip(e.target.checked)} />}
                    label="VIP"
                />
                <Divider />
                <Typography>Preço do curso:</Typography>
                <TextField
                    label="Preço"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    type="number"
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                    Criar Módulo
                </Button>
                <Button type="button" variant="outlined" onClick={() => navigate('/cursos')}>
                    Cancelar
                </Button>
            </form>
        </Container>
    );
}