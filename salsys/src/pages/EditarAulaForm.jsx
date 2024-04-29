import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import myfetch from '../utils/myfetch';
import moment from 'moment';
import { Container, Typography, Box, TextField, Button, Divider, FormControl, FormGroup, FormControlLabel, MenuItem, Grid, Avatar, Stack, Select, Checkbox } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import Waiting from '../ui/Waiting';

export default function EditarAulaForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [aula, setAula] = React.useState(null);
    const [alunos, setAlunos] = React.useState([]);
    const [profs, setProfs] = React.useState([])
    const [presencas, setPresencas] = React.useState([]);
    const [waiting, setWaiting] = React.useState(false);

    React.useEffect(() => {
        fetchProfs();
        fetchAula();
    }, []);

    const fetchProfs = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get('/professores')
            const sortedProfs = response.sort((a, b) => (a.user.nome > b.user.nome) ? 1 : -1);
            setProfs(sortedProfs);
            setWaiting(false)
        } catch (error) {
            console.error(error)
            alert('Erro lendo dados dos professores: ', error.message)
            setWaiting(false)
        }
    }

    const fetchAula = async () => {
        try {
            setWaiting(true);
            const response = await myfetch.get(`/aulas/${id}`);
            response.data = moment(response.data);
            
            setAula(response);
            if (response.modulo && response.modulo.professor) {
                setAula(prevState => ({ ...prevState, professorId: response.modulo.professor.id }))
            }
            
            setAlunos(response.presenca.map(presenca => presenca.aluno).sort((a, b) => a.user.nome.localeCompare(b.user.nome)));
            setPresencas(response.presenca);
            
            setWaiting(false);
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar aula: ', error.message);
            setWaiting(false);
        }
    };

    const handlePresencaChange = (alunoId) => (event) => {
        const { checked } = event.target
        const updatedPresencas = presencas.map((presenca) => {
            if (presenca.alunoId === alunoId) {
                return { ...presenca, presente: checked }
            }
            return presenca
        })
        setPresencas(updatedPresencas)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setWaiting(true);

            const presencasData = presencas.map(({ id, presente }) => ({ id, presente }))

            await myfetch.put(`/aulas/${id}`, {
                num: parseInt(aula.num),
                data: aula.data,
                conteudo: aula.conteudo,
                detalhes: aula.detalhes,
                presenca: {
                    updateMany: presencasData.map(({ id, presente }) => ({
                        where: { id },
                        data: { presente }
                    }))
                },
            });

            setWaiting(false);
            alert('Avaliação atualizada com sucesso!');
            navigate(`/modulo/${aula.moduloId}`);
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar avaliação: ', error.message);
            setWaiting(false);
        }
    };

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Editar Aula</Typography>
            <Divider />
            {aula && (
                <>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                        {aula.modulo.curso && (
                            <Avatar alt={aula.modulo.curso.nome} src={aula.modulo.curso.imageUrl} />
                        )}
                        <Typography variant='h5'>{aula.modulo.titulo}</Typography>
                    </Stack>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                            <Typography>Aula número:</Typography>
                            <TextField
                                type="number"
                                variant="filled"
                                sx={{backgroundColor: "white", color: "black"}}
                                value={aula.num}
                                onChange={(e) => setAula(prevState => ({ ...prevState, num: e.target.value }))}
                                fullWidth
                                margin="dense"
                            />
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>Data da Aula:</Typography>
                                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                                    <DatePicker
                                        variant="filled"
                                        sx={{backgroundColor: "white", color: "black"}}
                                        margin="normal"
                                        fullWidth
                                        value={aula.data}
                                        onChange={(newValue) => setAula(prevState => ({ ...prevState, data: newValue }))}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Professor:</Typography>
                                <FormControl fullWidth>
                                    <Select 
                                        variant="filled"
                                        sx={{backgroundColor: "white", color: "black"}}
                                        value={aula.professorId || ''} 
                                        onChange={(e) => setAula(prevState => ({
                                            ...prevState,
                                            professorId: e.target.value
                                        }))} 
                                        required
                                    >
                                        {profs.map((profs) => (
                                            <MenuItem key={profs.id} value={profs.id}>
                                                {profs.user && profs.user.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Typography sx={{ mt:2 }}>Título da Aula:</Typography>
                        <TextField
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            value={aula.conteudo}
                            onChange={(e) => setAula(prevState => ({ ...prevState, conteudo: e.target.value }))}
                            fullWidth
                            margin="normal"
                        />
                        <Typography sx={{ mt:2 }}>Conteúdo da Aula:</Typography>
                        <TextField
                            multiline
                            rows={2}
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            value={aula.detalhes}
                            onChange={(e) => setAula(prevState => ({ ...prevState, detalhes: e.target.value }))}
                            fullWidth
                            margin="normal"
                        />
                        <Typography sx={{ mt:2 }}>Registrar Presenças:</Typography>
                        <FormGroup>
                            {alunos.map(aluno => (
                                <div key={aluno.id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={presencas.find(presenca => presenca.alunoId === aluno.id)?.presente || false} 
                                                onChange={handlePresencaChange(aluno.id)} 
                                            />
                                        }
                                        label={aluno.user.nome}
                                    />
                                
                                </div>
                            ))}
                        </FormGroup>
                        <Box >
                            <Button type="submit" variant="contained" color="primary" sx={{ margin: 2 }}>Confirmar</Button>
                            <Button type="button" variant="outlined" sx={{ margin: 2 }} onClick={() => navigate(`/modulo/${aula.modulo.id}`)}>Cancelar</Button>
                        </Box>
                    </form>
                </>
            )}
        </Container>
    )
}
