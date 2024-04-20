import React from 'react';
import myfetch from '../utils/myfetch';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Container, Typography, Box, TextField, Button, Divider, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, FormGroup, Grid, Avatar, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import Waiting from '../ui/Waiting';


export default function NovaAulaForm() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [aula, setAula] = React.useState({
        data: moment(),
        conteudo: '',
        moduloId: id,
        professorId: ''
    })
    const [profs, setProfs] = React.useState([])
    const [alunos, setAlunos] = React.useState([])
    const [modulo, setModulo] = React.useState({})
    const [presencas, setPresencas] = React.useState({
        presente: false,
        alunoId: '',
        aulaId: ''
    })
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchProfs()
        fetchAlunos()
        fetchModulo()
    }, [])

    const fetchProfs = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get('/professores')
            const sortedProfs = response.sort((a, b) => (a.user.nome > b.user.nome) ? 1 : -1);
            setProfs(sortedProfs);
            setWaiting(false)
        } catch (error) {
            console.error('Erro lendo dados dos professores: ', error)
        }
    }

    const fetchAlunos = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get(`/alunos/modulo/${id}`)
            const sortedAlunos = response.sort((a, b) => (a.user.nome > b.user.nome) ? 1 : -1);
            setAlunos(sortedAlunos);
            setWaiting(false)
        } catch (error) {
            console.error('Erro lendo dados dos alunos: ', error)
        }
    }

    const fetchModulo = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get(`/modulos/${id}`)
            setModulo(response)
            if (response.professor) {
                setAula(prevState => ({
                    ...prevState,
                    professorId: response.professor.id
                }))
            }
            setWaiting(false)
        } catch (error) {
            console.error('Erro lendo dados do módulo: ', error)
        }
    }

    const handlePresencaChange = (alunoId) => (event) => {
        setPresencas({ ...presencas, [alunoId]: event.target.checked })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setWaiting(true)
            const aulaData = new Date(aula.data)

            const newAula = await myfetch.post('/aulas', {
                data: aulaData,
                conteudo: aula.conteudo,
                professor: { connect: { id: parseInt(aula.professorId) } },
                modulo: { connect: { id: parseInt(aula.moduloId)}}
            })

            for (const aluno of alunos) {
                const presente = presencas[aluno.id] || false
                await myfetch.post('/presencas', {
                    presente,
                    aluno: { connect: { id: aluno.id } },
                    aula: { connect: { id: newAula.id } }
                })
            }
            setWaiting(false)
            navigate(`/modulo/${modulo.id}`)
        } catch(error) {
            console.error('Erro registrando aula: ', error)
        }
    }
    
    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Registrar Aula</Typography>
            <Divider />
            {modulo && (
                <>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                        {modulo.curso && (
                            <Avatar alt={modulo.curso.nome} src={modulo.curso.imageUrl} />
                        )}
                        <Typography variant='h5'>{modulo.titulo}</Typography>
                    </Stack>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
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
                            <Grid item xs={8}>
                                <Typography>Professor:</Typography>
                                <FormControl fullWidth>
                                    <Select 
                                        variant="filled"
                                        sx={{backgroundColor: "white", color: "black"}}
                                        value={modulo.professor ? modulo.professor.id : ''} 
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
                        <Typography sx={{ mt:2 }}>Conteúdo Dado em Aula:</Typography>
                        <TextField
                            multiline
                            rows={2}
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            value={aula.conteudo}
                            onChange={(e) => setAula(prevState => ({ ...prevState, conteudo: e.target.value }))}
                            fullWidth
                            margin="normal"
                        />
                        <Typography sx={{ mt:2 }}>Registrar Presenças:</Typography>
                        <FormGroup>
                            {alunos.map(aluno => (
                                <FormControlLabel
                                    key={aluno.id}
                                    control={<Checkbox checked={presencas[aluno.id] || false} onChange={handlePresencaChange(aluno.id)} />}
                                    label={aluno.user.nome}
                                />
                            ))}
                        </FormGroup>
                        <Box >
                            <Button type="submit" variant="contained" color="primary" sx={{ margin: 2 }}>Registrar Aula</Button>
                            <Button type="button" variant="outlined" sx={{ margin: 2 }} onClick={() => navigate(`/modulo/${modulo.id}`)}>Cancelar</Button>
                        </Box>
                    </form>
                </>
            )}
        </Container>
    )
}