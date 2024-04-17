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
        wagrupo: '',
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
                const { horario, inicio, ...restData } = response

                console.log('Parsed data: ', restData)

                const parsedHorario = moment(horario)
                const parsedInicio = moment(inicio)
                
                setModuloData({
                    ...restData,
                    horario: parsedHorario,
                    inicio: parsedInicio,
                    professorId: restData.professorId
                })
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

            const response = await myfetch.put(`/modulos/${id}`, {
                titulo: moduloData.titulo,
                dias_sem: moduloData.dias_sem.map(dia => dia.dia),
                horario: moduloData.horario,
                dur_aula: parseInt(moduloData.dur_aula),
                inicio: moduloData.inicio,
                dur_modulo: parseInt(moduloData.dur_modulo),
                presencial: moduloData.presencial,
                remoto: moduloData.remoto,
                vip: moduloData.vip,
                preco: moduloData.preco,
                livro: moduloData.livro,
                wagrupo: moduloData.wagrupo,
                professor: {connect: { id: parseInt(moduloData.professorId) }}
            });

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
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        margin="normal"
                        fullWidth
                        value={moduloData.horario}
                        onChange={(newValue) => setModuloData(prevState => ({ ...prevState, horario: newValue }))}
                    />
                </LocalizationProvider>
                <Divider />
                <Typography>Tempo de Duração das Aulas (em minutos):</Typography>
                <TextField
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
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            margin="normal"
                            fullWidth
                            value={moduloData.inicio}
                            onChange={(newValue) => setModuloData(prevState => ({ ...prevState, inicio: newValue }))}
                        />
                </LocalizationProvider>
                <Divider />
                <Typography>Tempo de Duração do Módulo (em semanas):</Typography>
                <TextField
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
                    <Select 
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        value={moduloData.professorId ? moduloData.professorId : ''} 
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
                <Typography>Formato das Aulas (presencal remoto ou híbrido)</Typography>
                <FormControlLabel
                    control={<Checkbox checked={moduloData.presencial} 
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, presencial: e.target.checked}))} />}
                    label="Presencial"
                />
                <FormControlLabel
                    control={<Checkbox checked={moduloData.remoto} 
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, remoto: e.target.checked}))} />}
                    label="Remoto"
                />
                <Divider />
                <Typography>Cheque esta opção se curso for VIP: </Typography>
                <FormControlLabel
                    control={<Checkbox checked={moduloData.vip} 
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, vip: e.target.checked}))} />}
                    label="VIP"
                />
                <Divider />
                <Typography>Preço Mensal do Curso:</Typography>
                <TextField
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
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.livro}
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, livro: e.target.value}))}
                    fullWidth
                />
                <Divider />
                <Typography>Link para Grupo no WhatsApp:</Typography>
                <TextField
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.wagrupo}
                    onChange={(e) => setModuloData(prevState => ({ ...prevState, wagrupo: e.target.value}))}
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