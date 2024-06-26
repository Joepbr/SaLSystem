import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Container, Typography, TextField, Button, Divider, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import WeekdaySelector from '../ui/WeekdaySelector';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import myfetch from '../utils/myfetch';
import Waiting from '../ui/Waiting';

export default function NovoModuloForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [titulo, setTitulo] = React.useState('');
    const [diasSem, setDiasSem] = React.useState([]);
    const [horario, setHorario] = React.useState(moment());
    const [durAula, setDurAula] = React.useState('');
    const [inicio, setInicio] = React.useState(moment());
    const [durModulo, setDurModulo] = React.useState('');
    const [presencial, setPresencial] = React.useState(false);
    const [remoto, setRemoto] = React.useState(false);
    const [vip, setVip] = React.useState(false);
    const [preco, setPreco] = React.useState('');
    const [livro, setLivro] = React.useState('');
    const [wagrupo, setWagrupo] = React.useState('');
    const [professorId, setProfessorId] = React.useState('');
    const [professores, setProfessores] = React.useState([]);
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        const fetchProfessores = async () => {
            try {
                setWaiting(true)
                const response = await myfetch.get('/professores');
                const professores = response.map(professor => ({
                    id: professor.id,
                    nome: professor.user.nome
                }))
                setProfessores(professores);
                setWaiting(false)
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfessores();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo || !diasSem.length || !horario || !durAula || !inicio || !durModulo || !professorId){
            alert('Por favor, preencha todos os campos obrigatórios.')
            return
        }

        try {
            setWaiting(true)
            const response = await myfetch.post('/modulos', {
                titulo,
                dias_sem: diasSem.map(dia => dia.dia),
                horario,
                dur_aula: parseInt(durAula),
                inicio,
                dur_modulo: parseInt(durModulo),
                presencial,
                remoto,
                vip,
                preco: parseFloat(preco),
                livro,
                wagrupo,
                curso: { connect: { id: parseInt(id) } },
                professor: { connect: { id: parseInt(professorId) } },
            });
            
            console.log('Módulo criado: ', response)
            setWaiting(false)
            navigate('/cursos');
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    const handleWeekdaysChange = (weekdays) => {
        setDiasSem(weekdays);
      };
      

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Criar Novo Módulo</Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <Typography>Título do Módulo:</Typography>
                <TextField
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
                <WeekdaySelector selectedWeekdays={diasSem} onChange={handleWeekdaysChange} />
                <Divider />
                <Typography>Horário das Aulas:</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                    {moment.isMoment(horario) ? (
                        <TimePicker
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            margin="normal"
                            fullWidth
                            value={horario}
                            onChange={(newValue) => setHorario(newValue)}
                        >
                            <TextField
                                variant="filled"
                            />
                        </TimePicker>
                    ) : (
                        <div>Carregando...</div>
                    )}
                </LocalizationProvider>
                <Divider />
                <Typography>Tempo de Duração das Aulas (em minutos):</Typography>
                <TextField
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
                <Typography>Data de Início das Aulas:</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                    {moment.isMoment(inicio) ? (
                        <DatePicker
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            margin="normal"
                            fullWidth
                            value={inicio}
                            onChange={(newValue) => setInicio(newValue)}
                        >
                            <TextField
                                variant="filled"
                            />
                        </DatePicker>
                    ) : (
                        <div>Carregando...</div>
                    )}
                </LocalizationProvider>
                <Divider />
                <Typography>Tempo de Duração do Módulo (em Semanas):</Typography>
                <TextField
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
                    control={<Checkbox checked={presencial} 
                    onChange={(e) => setPresencial(e.target.checked)} />}
                    label="Presencial"
                />
                <FormControlLabel
                    control={<Checkbox checked={remoto} 
                    onChange={(e) => setRemoto(e.target.checked)} />}
                    label="Remoto"
                />
                <Divider />
                <Typography>Cheque esta opção se curso for VIP: </Typography>
                <FormControlLabel
                    control={<Checkbox checked={vip} 
                    onChange={(e) => setVip(e.target.checked)} />}
                    label="VIP"
                />
                <Divider />
                <Typography>Preço Mensal do Curso:</Typography>
                <TextField
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    type="number"
                    fullWidth
                />
                <Divider />
                <Typography>Livro a Ser Utilizado no Curso:</Typography>
                <TextField
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={livro}
                    onChange={(e) => setLivro(e.target.value)}
                    fullWidth
                />
                <Divider />
                <Typography>Link para Grupo no WhatsApp:</Typography>
                <TextField
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={wagrupo}
                    onChange={(e) => setWagrupo(e.target.value)}
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