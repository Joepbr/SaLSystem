import React from 'react';
import myfetch from '../utils/myfetch'
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom'
import { checkModuloAccess } from '../utils/CheckAccess';
import { Container, Typography, Divider, Box, Avatar, Stack, Button, IconButton, Link as MuiLink } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import moment from 'moment';
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

export default function AvaliacaoRecord() {
    const navigate = useNavigate()
    const {id} = useParams()
    const [avaliacao, setAvaliacao] = React.useState(null)
    const [arquivos, setArquivos] = React.useState({})
    const [waiting, setWaiting] = React.useState(false)
    const [moduloId, setModuloId] = React.useState(null)
    const [hasAccess, setHasAccess] = React.useState(null)

    React.useEffect(() => {
        fetchAvaliacao();
    }, []);

    React.useEffect(() =>{
        if (moduloId) {
            async function fetchAccess() {
                const access = await checkModuloAccess(moduloId)
                setHasAccess(access)
            }

            fetchAccess()
        }
    }, [moduloId])

    React.useEffect(() => {
        if (!avaliacao) {
            return
        } else {
            fetchArquivos()
        }
    }, [avaliacao])

    const fetchAvaliacao = async () => {
        try {
            setWaiting(true)
            const avaliacaoId = id
            const result = await myfetch.get(`/avaliacoes/${avaliacaoId}`)
            
            setAvaliacao(result)
            setModuloId(result.modulo?.id)
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
            setWaiting(false)
        }
    }

    const fetchArquivos = async () => {
        try {
            setWaiting(true)

            const filesPromises = avaliacao.notas.map(async (nota) => {
                const alunoId = nota.aluno.id
                const notaId = nota.id

                try {
                    const filesResponse = await myfetch.get(`/drive/${notaId}/prova`)

                    console.log(`FilesResponse value for aluno ${alunoId}: `, filesResponse)
                    return { alunoId, data: filesResponse }
                } catch (error) {
                    console.error(`Error fetching files for notaId: ${notaId}, alunoId: ${alunoId}`, error)
                    return { alunoId, data: null }
                }
            })

            const files = await Promise.all(filesPromises)
            const arquivosObject = files.reduce((acc, curr) => {
                console.log(`Current data being reduced: `, curr)
                if (curr.data !== undefined) {
                    acc[curr.alunoId] = curr.data
                }
                return acc
            }, {})
            
            setArquivos(arquivosObject)
            setWaiting(false)
        } catch (error) {
            console.error(error);
            console.log(`Erro ao carregar arquivos de provas: ${error.message}`);
            setWaiting(false);
        }
    }

    const handleFileDownload = async (arquivoId, fileName) => {
        try {
            setWaiting(true)

            const response = await myfetch.get(`/drive/${arquivoId}/downloadProva`, 'blob')

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

    const alunos = avaliacao ? avaliacao.notas.map(notas => notas?.aluno?.user?.nome).sort() : []
    
    const renderAluno = aluno => {
        const nota = avaliacao.notas.find(notas => notas?.aluno?.user?.nome === aluno);
        const alunoNota = nota?.nota || 0;
        const coment = nota?.coment || '';
        const alunoId = nota?.aluno?.id;
        const arquivo = arquivos[alunoId]

        console.log(`arquivo pertencente a aluno ${alunoId}:`, arquivo);

        return (
            <Stack direction="column">
                <Stack key={aluno} direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                    <Box sx={{ backgroundColor: 'white' }}>
                        <Typography sx={{ ml: 2, mr: 2, fontWeight: 'bold', color: alunoNota < 6 ? 'red' : 'blue' }} >{parseFloat(alunoNota).toFixed(2)}</Typography>
                    </Box>
                    <MuiLink component={Link} to={`/aluno/${alunoId}`} underline="none" >{aluno}</MuiLink>
                    {arquivo && arquivo !== null ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, ml: 2 }}>
                            <IconButton aria-label='Download arquivo' onClick={() => handleFileDownload(arquivo.id, arquivo.nome)}>
                                <CloudDownloadIcon color="secondary"/>
                            </IconButton>
                            <Typography sx={{fontSize: 'small'}}>{arquivo.nome}</Typography>
                        </Box>
                    ) : (
                        <Typography sx={{fontSize: 'small'}}>Nenhum arquivo disponível</Typography>
                    )}
                    
                </Stack>
                <Stack direction="row">
                    <Typography>Comentário: </Typography>
                    <Typography sx={{fontSize: 'small', ml: 2, mb: 2}}>{coment}</Typography>
                </Stack>
                <Divider/>
            </Stack>
        )
    }

    if (hasAccess === null || waiting) return <Waiting show={true}/>
    if (hasAccess === false) return <Navigate to="/forbidden" replace />

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