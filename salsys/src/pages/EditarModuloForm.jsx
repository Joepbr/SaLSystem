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

export default function EditarModuloForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [professores, setProfessores] = React.useState([])
    const [moduloData, setModuloData] = React.useState({
        titulo: '',
        dias_sem: [],
        horario: moment(),
        dur_aula: '',
        inicio: moment(),
        dur_modulo: '',
        presencial: false,
        remoto: false,
        vip: false,
        preco: '',
        livro: '',
        cursoId: '',
        professorId: ''
    });

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

    React.useEffect(() => {
        const fetchModuloData = async () => {
            try {
                const response = await myfetch.get(`/modulos/${id}`)
                const { horario, inicio, professorId: fetchedProfessorId, ...restData } = response

                const parsedHorario = moment(horario)
                const parsedInicio = moment(inicio)
                
                setModuloData({
                    ...restData,
                    horario: parsedHorario,
                    inicio: parsedInicio,
                    professorId: fetchedProfessorId
                })

                console.log('Modulo data from API:', moduloData);
            }
            catch (error) {
                console.error('Erro ao ler dados do módulo:', error);
            }
        }

        fetchModuloData()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
    
            console.log('Modulo data before submission:', moduloData);

            const response = await myfetch.put(`/modulos/${id}`);

            console.log('Dados do professor editados com sucesso:', response);
            navigate('/cursos');
        } catch (error) {
            console.error('Erro ao editar dados do professor:', error);
        }
    };

    const handleWeekdaysChange = (weekdays) => {
        setModuloData(prevState => ({
            ...prevState,
            dias_sem: weekdays
        }));
      };
      
    return (
        <Container>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Modificar Módulo</Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <Typography>Título do Módulo:</Typography>
                <TextField
                    label="Título"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.titulo}
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, titulo: e.target.value}))}
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Dias de Aula na Semana:</Typography>
                <WeekdaySelector selectedWeekdays={moduloData.dias_sem} onChange={handleWeekdaysChange} />
                <Divider />
                <Typography>Horário das Aulas:</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                    <TimePicker
                        label="Horário"
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        margin="normal"
                        fullWidth
                        value={moduloData.horario}
                        onChange={(newValue) => setModuloData(prevState => ({ ...prevState, horario: newValue }))}
                    />
                </LocalizationProvider>
                <Divider />
                <Typography>Tempo de Duração das Aulas:</Typography>
                <TextField
                    label="Duração da Aula (min)"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.dur_aula}
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, dur_aula: e.target.value }))}
                    type="number"
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Data de Início das Aulas:</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                        <DatePicker
                            label="Início das aulas"
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            margin="normal"
                            fullWidth
                            value={moduloData.inicio}
                            onChange={(newValue) => setModuloData(prevState => ({ ...prevState, inicio: newValue }))}
                        />
                </LocalizationProvider>
                <Divider />
                <Typography>Tempo de Duração do Módulo:</Typography>
                <TextField
                    label="Duração do Módulo (semanas)"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.dur_modulo}
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, dur_modulo: e.target.value }))}
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
                        value={moduloData.professorId || ''} 
                        onChange={(e) => setModuloData(prevState => ({
                            ...prevState,
                            professorId: e.target.value
                        }))} 
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
                    control={<Checkbox checked={moduloData.presencial} onChange={(e) => setModuloData(prevState => ({ ...prevState, presencial: e.target.checked}))} />}
                    label="Presencial"
                />
                <FormControlLabel
                    control={<Checkbox checked={moduloData.remoto} onChange={(e) => setModuloData(prevState => ({ ...prevState, remoto: e.target.checked}))} />}
                    label="Remoto"
                />
                <Divider />
                <Typography>Cheque esta opção se curso for VIP: </Typography>
                <FormControlLabel
                    control={<Checkbox checked={moduloData.vip} onChange={(e) => setModuloData(prevState => ({ ...prevState, vip: e.target.checked}))} />}
                    label="VIP"
                />
                <Divider />
                <Typography>Preço Mensal do Curso:</Typography>
                <TextField
                    label="Preço"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.preco}
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, preco: e.target.value}))}
                    type="number"
                    fullWidth
                />
                <Divider />
                <Typography>Livro a Ser Utilizado no Curso:</Typography>
                <TextField
                    label="Livro"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.livro}
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, livro: e.target.value}))}
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                    Editar Módulo
                </Button>
                <Button type="button" variant="outlined" onClick={() => navigate('/cursos')}>
                    Cancelar
                </Button>
            </form>
        </Container>
    );
}