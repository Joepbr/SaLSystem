import React from 'react';
import myfetch from '../utils/myfetch'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Divider, Box, Avatar, Checkbox, Stack, Button, Link as MuiLink } from '@mui/material';
import moment from 'moment';
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

export default function AulaRecord(){
    const navigate = useNavigate()
    const {id} = useParams()
    const [aula, setAula] = React.useState(null)
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchAula();
    }, []);

    const fetchAula = async () => {
        try {
            setWaiting(true)
            const aulaId = id;
            const result = await myfetch.get(`/aulas/${aulaId}`);
            setAula(result);
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    };

    const alunos = aula ? aula.presenca.map(presenca => presenca?.aluno?.user?.nome).sort() : []
    
    const renderAluno = aluno => {
        const presenca = aula.presenca.find(presenca => presenca?.aluno?.user?.nome === aluno);
        const isPresente = presenca?.presente || false;
        const alunoId = presenca?.aluno?.id;
        return (
            <Typography key={aluno} variant="body1" sx={{ color: isPresente ? 'inherit' : 'text.disabled' }}>
                <Checkbox checked={isPresente} disabled sx={{ '&.Mui-checked': {color: '#25254b'} }} />
                <MuiLink component={Link} to={`/aluno/${alunoId}`} underline="none" >{aluno}</MuiLink>
            </Typography>
        )
    }

    return (
        <Container>
            <Waiting show={waiting} />
            {aula && (
                <>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                        <Avatar alt={aula.modulo.curso.nome} src={aula.modulo.curso.imageUrl} sx={{ width: 56, height: 56 }} />
                        <Stack direction="column" spacing={2} alignItems="left" sx={{ margin: 2 }}>
                            <Typography variant="h4">{aula.modulo.titulo}</Typography>
                            <Typography variant="h5">{moment(aula.data).format('dddd, LL')}</Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Typography variant="h6" sx={{ margin: 2 }}>Professor: <MuiLink component={Link} to={`/prof/${aula.professor.id}`} underline="none" >{aula.professor.user.nome}</MuiLink></Typography>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                        <Typography variant="h5">Aula {aula.num}: </Typography>
                        <Typography variant="h4" sx={{ margin: 2 }}>{aula.conteudo}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ margin: 2 }}>{aula.detalhes}</Typography>
                    <Divider />
                    <Typography variant="h6" sx={{ margin: 2 }}>Registro de presenças:</Typography>
                    <Box sx={{ ml: 2 }}>
                        {alunos.map(renderAluno)}
                    </Box>
                    <Button type="button" variant="outlined" sx={{ margin: 2 }} onClick={() => navigate(`/modulo/${aula.modulo.id}`)}>Voltar</Button>
                </>
            )}
        </Container>
    )
}