import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import myfetch from '../utils/myfetch';
import moment from 'moment';
import { Container, Typography, Box, TextField, Button, Divider, FormControl, FormGroup, Grid, Avatar, Stack, IconButton, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Delete as DeleteIcon } from '@mui/icons-material'
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import Waiting from '../ui/Waiting';

export default function EditarAvaliacaoForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [avaliacao, setAvaliacao] = React.useState(null);
    const [alunos, setAlunos] = React.useState([]);
    const [notas, setNotas] = React.useState([]);
    const [arquivos, setArquivos] = React.useState({})
    const [fileInputs, setFileInputs] = React.useState({})
    const [fileUploaded, setFileUploaded] = React.useState(false)
    const [waiting, setWaiting] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);

    React.useEffect(() => {
        fetchAvaliacao();
    }, []);

    React.useEffect(() => {
        if (avaliacao, notas) {
            fetchArquivos()
        }
    }, [avaliacao])

    const fetchAvaliacao = async () => {
        try {
            setWaiting(true);
            const response = await myfetch.get(`/avaliacoes/${id}`);
            response.data = moment(response.data);
            setAvaliacao(response);
            setAlunos(response.notas.map(nota => nota.aluno).sort((a, b) => a.user.nome.localeCompare(b.user.nome)));
            setNotas(response.notas);
            setWaiting(false);
        } catch (error) {
            console.error(error);
            alert(`Erro ao carregar avaliação: ${error.message}`);
            setWaiting(false);
        }
    };

    const handleNotaChange = (alunoId) => (event) => {
        const nota = parseFloat(event.target.value);
        const updatedNotas = notas.map((notaItem) => {
            if (notaItem.aluno.id === alunoId) {
                return { ...notaItem, nota: nota };
            }
            return notaItem;
        });
        setNotas(updatedNotas);
    };

    const handleComentChange = (alunoId) => (event) => {
        const coment = event.target.value;
        const updatedNotas = notas.map((notaItem) => {
            if (notaItem.aluno.id === alunoId) {
                return { ...notaItem, coment: coment };
            }
            return notaItem;
        });
        setNotas(updatedNotas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setWaiting(true);

            const notasData = notas.map(({ id, nota, coment }) => ({ id, nota, coment }))

            await myfetch.put(`/avaliacoes/${id}`, {
                titulo: avaliacao.titulo,
                data: avaliacao.data,
                peso: parseInt(avaliacao.peso),
                notas: {
                    updateMany: notasData.map(({ id, nota, coment }) => ({
                        where: { id },
                        data: { nota, coment }
                    }))
                },
            });

            setWaiting(false);
            alert('Avaliação atualizada com sucesso!');
            navigate(`/modulo/${avaliacao.moduloId}`);
        } catch (error) {
            console.error(error);
            alert(`Erro ao atualizar avaliação: ${error.message}`);
            setWaiting(false);
        }
    };

    const fetchArquivos = async () => {
        try {
            setWaiting(true)
            const files = {}
            console.log(`All notas before fetching files:`, notas)
            
            for (const nota of notas) {
                try{ 
                    console.log(`Current nota being processed:`, nota)
                    const alunoId = nota.aluno.id
                    const notaId = nota.id

                    console.log(`Fetching files for notaId: ${notaId}, alunoId: ${alunoId}`)

                    const filesResponse = await myfetch.get(`/drive/${notaId}/prova`)
                    
                    if (filesResponse === 404) {
                        console.log(`Arquivo não encontrado para estudante ${alunoId}`)
                        files[alunoId] = null
                    } else {
                        files[alunoId] = filesResponse
                    }
                } catch (error) {
                    console.error(`Error fetching files for notaId: ${nota.id}, alunoId: ${nota.aluno.id}`, error)
                }
            }
            setArquivos(files)
            setWaiting(false)
        } catch (error) {
            console.error(error);
            console.log(`Erro ao carregar arquivos de provas: ${error.message}`);
            setWaiting(false);
        }
    }
    
    const MAX_FILE_SIZE_MB = 30

    const handleFileChange = (event, alunoId) => {
        const file = event.target.files[0]

        if (file && file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
            alert(`O tamanho do arquivo excede o limite de ${MAX_FILE_SIZE_MB}MB.`)
            setFileInputs(prevState => ({
                ...prevState,
                [alunoId]: null
            }))
        } else {
            setFileInputs(prevState => ({
                ...prevState,
                [alunoId]: file
            }))
            setFileUploaded(false)
        }
    }

    const handleFileUpload = async (alunoId, notaId) => {
        try {
            setUploading(true)

            console.log('Selected File: ', fileInputs[alunoId])

            const formData = new FormData()
            formData.append('file', fileInputs[alunoId])
            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });              

            const response = await myfetch.post(`/drive/${notaId}/uploadProva`, formData)
            console.log(response)
            
            await fetchArquivos()
            setFileUploaded(true)
            setFileInputs(prevState => ({
                ...prevState,
                [alunoId]: null
            }))
        } catch(error) {
            console.error(error);
            alert(`Erro no upload do arquivo: ${error.message}`);
        } finally {
            setUploading(false);
        }
    }

    const handleFileDelete = async (fileid) => {
        if (confirm('Deseja realmente excluir este arquivo?')) {
            try {
                setWaiting(true)

                const response = await myfetch.delete(`/drive/${fileid}/deleteProva`)

                if (response.status === 204) {
                    alert('Arquivo excluído com sucesso')
                }
                
                await fetchArquivos()
                setWaiting(false)
            } catch(error) {
                console.error(error);
                alert(`Erro ao excluir arquivo: ${error.message}`);
                setWaiting(false)
            }
        }
    }

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Editar Avaliação</Typography>
            <Divider />
            {avaliacao && (
                <>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                        {avaliacao.modulo.curso && (
                            <Avatar alt={avaliacao.modulo.curso.nome} src={avaliacao.modulo.curso.imageUrl} />
                        )}
                        <Typography variant='h5'>{avaliacao.modulo.titulo}</Typography>
                    </Stack>
                    {avaliacao.professor && (
                        <Typography variant='h6' sx={{ mb: 2 }}>Professor: {avaliacao.professor.user.nome}</Typography>
                    )}
                    <Divider />
                    <form onSubmit={handleSubmit}>
                        <Typography sx={{ mt: 2 }}>Título da Avaliação:</Typography>
                        <TextField
                            variant="filled"
                            sx={{ backgroundColor: "white", color: "black" }}
                            value={avaliacao.titulo}
                            onChange={(e) => setAvaliacao(prevState => ({ ...prevState, titulo: e.target.value }))}
                        />
                        <Grid container spacing={2} sx={{ margin: 2 }}>
                            <Grid item xs={2}>
                                <Typography>Peso:</Typography>
                                <TextField
                                    type="number"
                                    variant="filled"
                                    sx={{ backgroundColor: "white", color: "black" }}
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
                                        sx={{ backgroundColor: "white", color: "black" }}
                                        fullWidth
                                        value={avaliacao.data}
                                        onChange={(newValue) => setAvaliacao(prevState => ({ ...prevState, data: newValue }))}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography variant='h6' sx={{ margin: 2 }}>Registrar Notas:</Typography>
                        <FormGroup>
                            {alunos.map(aluno => {
                                const notaId = notas.find(nota => nota.aluno.id === aluno.id)?.id
                                const alunoId = aluno.id
                                const uploadedFile = arquivos[alunoId]

                                return (
                                    <div key={aluno.id}>
                                        <Stack direction="column">
                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                                                <FormControl>
                                                    <TextField
                                                        type="number"
                                                        sx={{ backgroundColor: "white", color: "black", width: 100 }}
                                                        size="small"
                                                        inputProps={{ step: "0.05", min: 0, max: 10 }}
                                                        value={notas.find(nota => nota.aluno.id === aluno.id)?.nota || 0}
                                                        onChange={handleNotaChange(aluno.id)}
                                                    />
                                                </FormControl>
                                                <Typography>{aluno.user.nome}</Typography>
                                                {uploadedFile ? (
                                                    <>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, ml: 2 }}>
                                                            <CloudCircleIcon />
                                                            <Typography sx={{ ml: 1, fontSize: 'small'}}>{uploadedFile.nome}</Typography>
                                                                <IconButton aria-label="Excluir" onClick={() => handleFileDelete(uploadedFile.id)}>
                                                                    <DeleteIcon color="error" />
                                                                </IconButton>
                                                        </Box>
                                                    </>
                                                ) : (
                                                    <>
                                                        <input type="file" onChange={(event) => handleFileChange(event, aluno.id)} />
                                                        {fileInputs[alunoId] && (
                                                            <>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
                                                                    <Typography sx={{ margin: 1 }}>{fileInputs[alunoId].name}</Typography>
                                                                    {uploading ? (
                                                                        <CircularProgress size={20} />
                                                                    ) : fileUploaded ? (
                                                                        <CheckCircleIcon color="success" />
                                                                    ) : null}
                                                                </Box>
                                                            </>
                                                        )}
                                                        <IconButton 
                                                            aria-label="upload" 
                                                            onClick={() => handleFileUpload(aluno.id, notaId)} 
                                                            disabled={!fileInputs[alunoId] || uploading}
                                                            sx={{
                                                                '&.Mui-disabled': {
                                                                    opacity: 0.5
                                                                }
                                                            }}
                                                        >
                                                            <CloudUploadIcon color="primary" />
                                                        </IconButton>
                                                    </>
                                                )}
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
                                )
                            })}
                        </FormGroup>
                        <Box>
                            <Button type="submit" variant="contained" sx={{ margin: 2 }}>Salvar Alterações</Button>
                            <Button type="button" variant="outlined" sx={{ margin: 2 }} onClick={() => navigate(`/modulo/${avaliacao.moduloId}`)}>Cancelar</Button>
                        </Box>
                    </form>
                </>
            )}
        </Container>
    )
}
