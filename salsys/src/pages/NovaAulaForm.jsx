import React from 'react';
import myfetch from '../utils/myfetch';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Container, Typography, Box, TextField, Button, Divider, FormControl, Select, MenuItem, FormControlLabel, Checkbox, FormGroup, Grid, Avatar, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import Waiting from '../ui/Waiting';


export default function NovaAulaForm() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [aula, setAula] = React.useState({
        num: '',
        data: moment(),
        conteudo: '',
        detalhes: '',
        moduloId: id,
        professorId: ''
    })
    const [profs, setProfs] = React.useState([])
    const [alunos, setAlunos] = React.useState([])
    const [modulo, setModulo] = React.useState({})
    const [presencas, setPresencas] = React.useState([])
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
            console.error(error)
            alert('Erro lendo dados dos professores: ', error.message)
            setWaiting(false)
        }
    }

    const fetchAlunos = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get(`/alunos/modulo/${id}`)
            const sortedAlunos = response.sort((a, b) => (a.user.nome > b.user.nome) ? 1 : -1);
            setAlunos(sortedAlunos);

            const initialPresencas = sortedAlunos.map((aluno) => ({
                alunoId: aluno.id,
                aulaId: null,
                presente: false
            }))
            setPresencas(initialPresencas)

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
                setAula(prevState => ({
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
        e.preventDefault()

        try {
            setWaiting(true)
            const aulaData = new Date(aula.data)

            const newAula = await myfetch.post('/aulas', {
                num: parseInt(aula.num),
                data: aulaData,
                conteudo: aula.conteudo,
                detalhes: aula.detalhes,
                professor: { connect: { id: parseInt(aula.professorId) } },
                modulo: { connect: { id: parseInt(aula.moduloId) } }
            })
            
            await Promise.all(alunos.map(async (aluno) => {
                const presente = presencas.find((presenca) => presenca.alunoId === aluno.id)?.presente || false
                const response = await myfetch.post('/presencas', {
                    presente,
                    aluno: { connect: { id: aluno.id } },
                    aula: { connect: { id: newAula.id } }
                })
            }))
            
            setWaiting(false)
            navigate(`/modulo/${modulo.id}`)
        } catch(error) {
            console.error(error)
            alert('Erro ao registrar avaliações: ', error.message)
            setWaiting(false)
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
                            sx={{backgroundColor: "white", color: "black", mb: 2}}
                            value={aula.detalhes}
                            onChange={(e) => setAula(prevState => ({ ...prevState, detalhes: e.target.value }))}
                            fullWidth
                            margin="normal"
                        />
                        <Divider />
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
                            <Button type="submit" variant="contained" color="primary" sx={{ margin: 2 }}>Registrar Aula</Button>
                            <Button type="button" variant="outlined" sx={{ margin: 2 }} onClick={() => navigate(`/modulo/${modulo.id}`)}>Cancelar</Button>
                        </Box>
                    </form>
                </>
            )}
        </Container>
    )
}