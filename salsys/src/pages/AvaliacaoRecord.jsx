import React from 'react';
import myfetch from '../utils/myfetch'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Divider, Box, Avatar, Checkbox, Stack, Button, Link as MuiLink } from '@mui/material';
import moment from 'moment';
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

export default function AvaliacaoRecord() {
    const navigate = useNavigate()
    const {id} = useParams()
    const [avaliacao, setAvaliacao] = React.useState(null)
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchAvaliacao();
    }, []);

    const fetchAvaliacao = async () => {
        try {
            setWaiting(true)
            const avaliacaoId = id
            const result = await myfetch.get(`/avaliacoes/${avaliacaoId}`)
            setAvaliacao(result)
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    }

    const alunos = avaliacao ? avaliacao.notas.map(notas => notas?.aluno?.user?.nome).sort() : []
    
    const renderAluno = aluno => {
        const nota = avaliacao.notas.find(notas => notas?.aluno?.user?.nome === aluno);
        const alunoNota = nota?.nota || 0;
        const alunoId = nota?.aluno?.id;
        return (
            <Stack key={aluno} direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                <Box sx={{ backgroundColor: 'white' }}>
                    <Typography sx={{ ml: 2, mr: 2, fontWeight: 'bold', color: alunoNota < 6 ? 'red' : 'blue' }} >{parseFloat(alunoNota).toFixed(2)}</Typography>
                </Box>
                <MuiLink component={Link} to={`/aluno/${alunoId}`} underline="none" >{aluno}</MuiLink>
            </Stack>
        )
    }

    return(
        <Container>
            <Waiting show={waiting} />
            {avaliacao && (
                <>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                        <Avatar alt={avaliacao.modulo.curso.nome} src={avaliacao.modulo.curso.imageUrl} sx={{ width: 56, height: 56 }} />
                        <Stack direction="column" spacing={2} alignItems="left" sx={{ margin: 2 }}>
                            <Typography variant="h4">{avaliacao.modulo.titulo}</Typography>
                            <Typography variant="h5">{moment(avaliacao.data).format('dddd, LL')}</Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Typography variant="h6" sx={{ margin: 2 }}>Professor: <MuiLink component={Link} to={`/prof/${avaliacao.professor.id}`} underline="none" >{avaliacao.professor.user.nome}</MuiLink></Typography>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                        <Typography variant="h5">Avaliação: </Typography>
                        <Typography variant="h4" sx={{ margin: 2 }}>{avaliacao.titulo}</Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ margin: 2 }}>Peso: {avaliacao.peso}</Typography>
                    <Divider />
                    <Typography variant="h6" sx={{ margin: 2 }}>Registro de notas:</Typography>
                    <Box sx={{ ml: 2 }}>
                        {alunos.map(renderAluno)}
                    </Box>
                    <Button type="button" variant="outlined" sx={{ margin: 2 }} onClick={() => navigate(`/modulo/${avaliacao.modulo.id}`)}>Voltar</Button>
                </>
            )}
        </Container>
    )
}