import React from 'react';
import myfetch from '../utils/myfetch'
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom'
import { checkModuloAccess } from '../utils/CheckAccess';
import { Container, Typography, Divider, Box, Avatar, Checkbox, Stack, Button, Link as MuiLink } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import moment from 'moment';
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

export default function AulaRecord(){
    const navigate = useNavigate()
    const {id} = useParams()
    const [aula, setAula] = React.useState(null)
    const [arquivos, setArquivos] = React.useState([])
    const [waiting, setWaiting] = React.useState(false)
    const [moduloId, setModuloId] = React.useState(null)
    const [hasAccess, setHasAccess] = React.useState(null)

    React.useEffect(() => {
        fetchAula();
    }, []);

    React.useEffect(() => {
        if (moduloId) {
            async function fetchAccess() {
                const access = await checkModuloAccess(moduloId)
                setHasAccess(access)
            }

            fetchAccess()
        }
    }, [moduloId])

    const fetchAula = async () => {
        try {
            setWaiting(true)
            const aulaId = id;
            const result = await myfetch.get(`/aulas/${aulaId}`);
            
            setAula(result);
            setModuloId(result.modulo?.id)

            const filesResponse = await myfetch.get(`/drive/${id}/arquivos`)
            setArquivos(filesResponse)

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

    const handleFileDownload = async (arquivoId, fileName) => {
        try {
            setWaiting(true)

            const response = await myfetch.get(`/drive/${arquivoId}/download`, 'blob')

            const blob = new Blob([response])
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            a.click()
            window.URL.revokeObjectURL(url)

            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    }

    if (hasAccess === null || waiting) return <Waiting show={true}/>
    if (hasAccess === false) return <Navigate to="/forbidden" replace />

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
                    {arquivos.length > 0 && (
                        <>
                            <Typography sx={{ margin: 2, fontWeight: 'bold' }}>Arquivos Para Download:</Typography>
                            {arquivos.map(arquivo => (
                                <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }} key={arquivo.id}>
                                    <CloudCircleIcon sx={{ mr: 1}}/>
                                    <Typography>{arquivo.nome}</Typography>
                                    <Button 
                                        variant="contained" 
                                        size="small" 
                                        color="secondary" 
                                        sx={{ ml: 2 }} 
                                        startIcon={<CloudDownloadIcon/>}
                                        onClick={() => handleFileDownload(arquivo.id, arquivo.nome)}
                                    >
                                        Download
                                    </Button>
                                </Box>
                            ))}
                            <Divider />
                        </>
                    )}
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