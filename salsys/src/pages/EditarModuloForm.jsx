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
                const moduloData = await myfetch.get(`/modulos/${id}`)

                setModuloData(moduloData)
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
        setDiasSem(weekdays);
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
                    value={moduloData.titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Dias de Aula na Semana:</Typography>
                <WeekdaySelector selectedWeekdays={moduloData.dias_sem} onChange={handleWeekdaysChange} />
                <Divider />
                <Typography>Horário das Aulas:</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                    {moment.isMoment(moduloData.horario) ? (
                        <TimePicker
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            margin="normal"
                            fullWidth
                            value={moduloData.horario}
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
                <Typography>Tempo de Duração das Aulas:</Typography>
                <TextField
                    label="Duração da Aula (min)"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.dur_aula}
                    onChange={(e) => setDurAula(e.target.value)}
                    type="number"
                    fullWidth
                    required
                />
                <Divider />
                <Typography>Data de Início das Aulas:</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                    {moment.isMoment(moduloData.inicio) ? (
                        <DatePicker
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            margin="normal"
                            fullWidth
                            value={moduloData.inicio}
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
                <Typography>Tempo de Duração do Módulo:</Typography>
                <TextField
                    label="Duração do Módulo (semanas)"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.dur_modulo}
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
                        value={moduloData.professorId} 
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
                    control={<Checkbox checked={moduloData.presencial} onChange={(e) => setPresencial(e.target.checked)} />}
                    label="Presencial"
                />
                <FormControlLabel
                    control={<Checkbox checked={moduloData.remoto} onChange={(e) => setRemoto(e.target.checked)} />}
                    label="Remoto"
                />
                <Divider />
                <Typography>Cheque esta opção se curso for VIP: </Typography>
                <FormControlLabel
                    control={<Checkbox checked={moduloData.vip} onChange={(e) => setVip(e.target.checked)} />}
                    label="VIP"
                />
                <Divider />
                <Typography>Preço do curso:</Typography>
                <TextField
                    label="Preço"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    value={moduloData.preco}
                    onChange={(e) => setPreco(e.target.value)}
                    type="number"
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