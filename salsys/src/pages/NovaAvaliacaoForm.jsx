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
    const [avaliacoes, setAvaliacoes] = React.useState([])
    const [alunos, setAlunos] = React.useState([])
    const [modulo, setModulo] = React.useState({})
    const [titulo, setTitulo] = React.useState('')
    const [data, setData] = React.useState(moment())
    const [peso, setPeso] = React.useState(1)
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
            setAvaliacoes(sortedAlunos.map(aluno => ({
                alunoId: parseInt(aluno.id),
                nota: 0
            })))
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
            setWaiting(false)
        } catch (error) {
            console.error(error)
            alert('Erro lendo dados do módulo: ', error.message)
            setWaiting(false)
        }
    }

    const handleSubmit = async() => {
        try {
            setWaiting(true)
            const avalData = new Date(data)

            await Promise.all(avaliacoes.map(avaliacao =>
                myfetch.post('/avaliacoes', {
                    nota: avaliacao.nota,
                    titulo: titulo,
                    data: avalData,
                    peso: parseInt(peso),
                    modulo: { connect: { id: parseInt(id) } },
                    professor: { connect: { id: parseInt(modulo.professor.id) } },
                    aluno: { connect: { id: parseInt(avaliacao.alunoId) } }
                })
            ))
            setWaiting(false)
            navigate(`/modulo/${id}`);
        } catch (error) {
            console.error(error)
            alert('Erro ao registrar avaliações: ', error.message)
            setWaiting(false)
        }
    }

    const handleNotaChange =(alunoId, value) => {
        setAvaliacoes(prevState => {
            const newAvaliacoes = [...prevState]
            const index = newAvaliacoes.findIndex(avaliacao => avaliacao.alunoId === alunoId)
            if (index !== -1) {
                newAvaliacoes[index] = {
                    ...newAvaliacoes[index],
                    nota: parseFloat(value)
                }
            }
            return newAvaliacoes
        })
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
                    <Typography sx={{ mt: 2 }}>Título da Avaliação:</Typography>
                    <TextField 
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <Grid container spacing={2} sx={{ margin: 2 }}>
                        <Grid item xs={2}>
                        <Typography>Peso:</Typography>
                        <TextField
                            type="number"
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            inputProps={{ min: 1, max: 5 }}
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                        />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>Data de Aplicação:</Typography>
                            <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                                <DatePicker
                                    variant="filled"
                                    sx={{backgroundColor: "white", color: "black"}}
                                    fullWidth
                                    value={data}
                                    onChange={(newValue) => setData(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Typography variant='h6' sx={{ margin:2 }}>Registrar Notas:</Typography>
                    <FormGroup>
                        {alunos.map(aluno => (
                            <div key={aluno.id}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                                    <FormControl>
                                        <TextField
                                            type="number"
                                            sx={{backgroundColor: "white", color: "black", width: 100}}
                                            size="small"
                                            inputProps={{ step: "0.05", min: 0, max: 10 }}
                                            value={avaliacoes.find(avaliacao => avaliacao.alunoId === aluno.id)?.nota || ''}
                                            onChange={(e) => handleNotaChange(aluno.id, e.target.value)}
                                        />
                                    </FormControl>
                                <Typography>{aluno.user.nome}</Typography>
                                </Stack>
                            </div>
                        ))}
                    </FormGroup>
                    <Divider />
                    <Button variant="contained" sx={{margin: 2}} onClick={handleSubmit}>Registrar Avaliações</Button>
                   <Button type="button" variant="outlined" sx={{margin: 2}} onClick={() => navigate(`/modulo/${id}`)}>Cancelar</Button>
                </>
            )}
        </Container>
    )
}