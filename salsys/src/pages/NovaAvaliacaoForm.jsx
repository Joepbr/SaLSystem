import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import myfetch from '../utils/myfetch';
import moment from 'moment';
import { Container, Typography, Box, TextField, Button, Divider, FormControl, Select, MenuItem, FormControlLabel, Checkbox, FormGroup, Grid, Avatar, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import Waiting from '../ui/Waiting';

export default function NovaAvaliacaoForm() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [avaliacao, setAvaliacao] = React.useState({
        titulo: '',
        data: moment(),
        peso: 1,
        moduloId: id,
        professorId: ''
    })
    const [alunos, setAlunos] = React.useState([])
    const [modulo, setModulo] = React.useState({})
    const [notas, setNotas] = React.useState([])
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchAlunos()
        fetchModulo()
    }, [])

    const fetchAlunos = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get(`/alunos/modulo/${id}`)
            const sortedAlunos = response.sort((a, b) => (a.user.nome > b.user.nome) ? 1 : -1);
            setAlunos(sortedAlunos);

            const initialNotas = sortedAlunos.map((aluno) => ({
                alunoId: aluno.id,
                avaliacaoId: null,
                nota: 0,
                coment: ''
            }))
            setNotas(initialNotas)

            setWaiting(false)
        } catch (error) {
            console.error(error)
            alert('Erro lendo dados dos alunos: ', error.message)
            setWaiting(false)
        }
    }

    const fetchModulo = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get(`/modulos/${id}`)
            setModulo(response)
            if (response.professor) {
                setAvaliacao(prevState => ({
                    ...prevState,
                    professorId: response.professor.id
                }))
            }
            setWaiting(false)
        } catch (error) {
            console.error(error)
            alert('Erro lendo dados do módulo: ', error.message)
            setWaiting(false)
        }
    }

    const handleNotaChange = (alunoId) => (event) => {
        const nota = parseFloat(event.target.value)
        const updatedNotas = notas.map((notaItem) => {
            if (notaItem.alunoId === alunoId) {
                return { ...notaItem, nota: nota }
            }
            return notaItem
        })
        setNotas(updatedNotas)
    }

    const handleComentChange = (alunoId) => (event) => {
        const coment = event.target.value
        const updatedNotas = notas.map((notaItem) => {
            if (notaItem.alunoId === alunoId) {
                return { ...notaItem, coment: coment }
            }
            return notaItem
        })
        setNotas(updatedNotas)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            setWaiting(true)
            const avalData = new Date(avaliacao.data)

            const newAval = await myfetch.post('/avaliacoes', {
                titulo: avaliacao.titulo,
                data: avalData,
                peso: parseInt(avaliacao.peso),
                professor: { connect: { id: parseInt(avaliacao.professorId) } },
                modulo: { connect: { id: parseInt(avaliacao.moduloId) } }
            })

            await Promise.all(alunos.map(async (aluno) => {
                const nota = notas.find((nota) => nota.alunoId === aluno.id)?.nota || 0
                const coment = notas.find((nota) => nota.alunoId === aluno.id)?.coment || ''
                const response = await myfetch.post('/notas', {
                    nota,
                    coment,
                    aluno: { connect: { id: aluno.id } },
                    avaliacao: { connect: { id: newAval.id } }
                })
            }))
            
            setWaiting(false)
            navigate(`/modulo/${id}`);
        } catch (error) {
            console.error(error)
            alert('Erro ao registrar avaliações: ', error.message)
            setWaiting(false)
        }
    }

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Registrar Avaliação</Typography>
            <Divider />
            {modulo && (
                <>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                        {modulo.curso && (
                            <Avatar alt={modulo.curso.nome} src={modulo.curso.imageUrl} />
                        )}
                        <Typography variant='h5'>{modulo.titulo}</Typography>
                    </Stack>
                    {modulo.professor &&
                        <Typography variant='h6' sx={{ mb: 2 }}>Professor: {modulo.professor.user.nome}</Typography>
                    }
                    <Divider />
                    <form onSubmit={handleSubmit}>
                        <Typography sx={{ mt: 2 }}>Título da Avaliação:</Typography>
                        <TextField 
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            value={avaliacao.titulo}
                            onChange={(e) => setAvaliacao(prevState => ({ ...prevState, titulo: e.target.value }))}
                        />
                        <Grid container spacing={2} sx={{ margin: 2 }}>
                            <Grid item xs={2}>
                                <Typography>Peso:</Typography>
                                <TextField
                                    type="number"
                                    variant="filled"
                                    sx={{backgroundColor: "white", color: "black"}}
                                    inputProps={{ min: 1, max: 5 }}
                                    value={avaliacao.peso}
                                    onChange={(e) => setAvaliacao(prevState => ({ ...prevState, peso: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>Data de Aplicação:</Typography>
                                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                                    <DatePicker
                                        variant="filled"
                                        sx={{backgroundColor: "white", color: "black"}}
                                        fullWidth
                                        value={avaliacao.data}
                                        onChange={(newValue) => setAvaliacao(prevState => ({ ...prevState, data: newValue }))}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography variant='h6' sx={{ margin:2 }}>Registrar Notas:</Typography>
                        <FormGroup>
                            {alunos.map(aluno => (
                                <div key={aluno.id}>
                                    <Stack direction="column">
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                                            <FormControl>
                                                <TextField
                                                    type="number"
                                                    sx={{backgroundColor: "white", color: "black", width: 100}}
                                                    size="small"
                                                    inputProps={{ step: "0.05", min: 0, max: 10 }}
                                                    value={notas.find(notas => notas.alunoId === aluno.id)?.nota || 0}
                                                    onChange={handleNotaChange(aluno.id)}
                                                />
                                            </FormControl>
                                            <Typography>{aluno.user.nome}</Typography>
                                        </Stack>
                                        <Typography>Comentário: </Typography>
                                        <FormControl>
                                            <TextField
                                                sx={{backgroundColor: "white", color: "black", width: 700, mb:2}}
                                                size="small"
                                                multiline
                                                value={notas.find(notas => notas.alunoId === aluno.id)?.coment || ''}
                                                onChange={handleComentChange(aluno.id)}
                                            />
                                        </FormControl>
                                    </Stack>
                                    <Divider/>
                                </div>
                            ))}
                        </FormGroup>
                        <Box>
                            <Button type="submit" variant="contained" sx={{margin: 2}} >Registrar Avaliação</Button>
                            <Button type="button" variant="outlined" sx={{margin: 2}} onClick={() => navigate(`/modulo/${id}`)}>Cancelar</Button>
                        </Box>
                    </form>
                </>
            )}
        </Container>
    )
}