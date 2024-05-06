import React from 'react';
import myfetch from '../utils/myfetch'
import { Link, useParams } from 'react-router-dom'

import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, FormControl, MenuItem, ListItemIcon, ListItemText, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Stack, IconButton, Link as MuiLink } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Delete as DeleteIcon } from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";

import theme from '../utils/theme';
import moment from 'moment';
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

export default function AlunoProfile() {
    const { id } = useParams()
    const [aluno, setAluno] = React.useState(null)
    const [idade, setIdade] = React.useState(null)
    const [arquivos, setArquivos] = React.useState({})
    const [openEnrollDialog, setOpenEnrollDialog] = React.useState(false)
    const [selectedModulo, setSelectedModulo] = React.useState(null)
    const [availableModulos, setAvailableModulos] = React.useState([])
    const [matriculas, setMatriculas] = React.useState([])
    const [expandedAccordion, setExpandedAccordion] = React.useState(null)
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() =>{
        if (aluno) {
            const today = moment()
            const alunoIdade = today.diff(aluno.data_nasc, 'years')
            setIdade(parseInt(alunoIdade))
            fetchArquivos()
        }
    }, [aluno])

    React.useEffect(() => {
        fetchAluno();
    }, []);

    const fetchAluno = async () => {
        try {
            setWaiting(true)
            const alunoId = id;
            const result = await myfetch.get(`/alunos/${alunoId}`);
            setAluno(result);
            setWaiting(false)
            fetchModulos()
            fetchMatriculas()
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    };

    const fetchModulos = async () => {
        try {
            setWaiting(true)
            const result = await myfetch.get('/modulos')
            setAvailableModulos(result)
            setWaiting(false)
        } catch (error) {
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    const fetchMatriculas = async () => {
        try {
            setWaiting(true)
            const result = await myfetch.get(`/matriculas/aluno/${id}`)
            setMatriculas(result)
            setWaiting(false)
        } catch (error) {
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    const handleEnrollClick = () => {
        setOpenEnrollDialog(true);
    };

    const handleEnrollConfirmation = async () => {
        if (selectedModulo) {
            try {
                setWaiting(true)
                await myfetch.post('/matriculas', {
                    alunoId: aluno.id,
                    moduloId: selectedModulo.id
                })
                setOpenEnrollDialog(false)
                setWaiting(false)

                await fetchAluno()
            } catch (error) {
                console.error(error)
                alert('ERRO: ' + error.message)
            }
        }
    }

    const handleAccordionChange = (index) => {
        setExpandedAccordion(expandedAccordion === index ? null : index);
    }

    const handleDeleteConfirmation = (matriculaId) => {
        if(window.confirm('Tem certeza que deseja cancelar esta matrícula?')) {
            handleCancelMatricula(matriculaId)
        }
    }

    const handleCancelMatricula = async (matriculaId) => {
        try {
            setWaiting(true)
            await myfetch.delete(`/matriculas/${matriculaId}`)
            setWaiting(false)
            await fetchMatriculas()
        } catch (error) {
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    const fetchArquivos = async () => {
        try {
            setWaiting(true)
            const files = {}

            for (const nota of aluno.notas) {
                const notaId = nota.id
                try{ 
                    const filesResponse = await myfetch.get(`/drive/${notaId}/prova`)
                    
                    if (filesResponse) {
                        files[notaId] = filesResponse
                    } else {
                        console.log(`Arquivo não encontrado para notaId ${notaId}`)
                        files[notaId] = null
                    }
                } catch (error) {
                    console.error(`Error fetching files for notaId: ${nota.id}, alunoId: ${aluno.id}`, error)
                    files[notaId] = null
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

    const showNotas = (presencas, notas, matricula) => {
        let totalAulas = matricula.modulo.aula.length
        let numPres = 0
        let percPres = 0
        for (let i=0; i<presencas.length; i++){
            if(presencas[i].aula.modulo.id === matricula.modulo.id){
                if(presencas[i].presente){
                    numPres++
                }
            }
        }
        percPres = (numPres / totalAulas) * 100

        const notasModulo = notas.filter(nota => nota.avaliacao.modulo.id === matricula.modulo.id)

        const notasByAvaliacao = {}
        notasModulo.forEach(nota => {
            const titulo = nota.avaliacao.titulo
            if (!notasByAvaliacao[titulo]) {
                notasByAvaliacao[titulo] = {notas: [], peso: nota.avaliacao.peso, id: nota.id}
            }
            notasByAvaliacao[titulo].notas.push(nota.nota)
        })

        const calcularFinal = (notasModulo) => {
            let soma = 0
            let pesos = 0

            notasModulo.forEach(({ nota, avaliacao }) => {
                soma += nota * avaliacao.peso
                pesos += avaliacao.peso
            })

            const final = (soma + (percPres/10)) / (pesos + 1)
            
            return parseFloat(final).toFixed(2)
        }
        
        return (
            <>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2 }}>
                    <Stack direction="column" spacing={1} alignItems="Left" sx={{ ml: 2, paddingRight: 2 }}>
                        <Typography>Aulas: {totalAulas}</Typography>
                        <Typography>Presenças: {numPres} ({percPres}%)</Typography>
                    </Stack>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <table style={{ borderCollapse: 'collapse', width: '30%' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <th style={{ textAlign: 'center', padding: '8px' }}>Avaliação</th>
                                <th style={{ textAlign: 'center', padding: '8px' }}>Peso</th>
                                <th style={{ textAlign: 'center', padding: '8px' }}>Nota</th>
                                <th style={{ textAlign: 'center', padding: '8px' }}>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(notasByAvaliacao).map(([titulo, { notas, peso, id }]) => (
                                <tr key={titulo} style={{ borderBottom: '1px solid #ccc' }}>
                                    {console.log('notas: ', notas)}
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{titulo}</td>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>{peso}</td>
                                    <td style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold', fontSize: 'larger'}}>
                                        {notas.map((nota, index) => (
                                            <React.Fragment key={index}>
                                                <span style={{ color: nota < 6 ? 'red' : 'blue' }}>
                                                    {nota}
                                                </span>
                                                {index !== notas.length -1 && ', '}
                                            </React.Fragment>
                                        ))}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '8px' }}>
                                        {arquivos[id] ? (
                                            <IconButton aria-label='Download arquivo' onClick={() => handleFileDownload(arquivos[id].id, arquivos[id].nome)}>
                                                <CloudDownloadIcon color='secondary' />
                                            </IconButton>
                                        ) : (
                                            <CloudOffIcon color='disabled'/>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Stack direction="column" spacing={1} alignItems="Center" sx={{ ml: 2, paddingLeft: 2 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Nota Final:</Typography>
                        {matricula.modulo.active && (
                            <Typography>(Parcial)</Typography>
                        )}
                        <Typography sx={{ fontWeight: 'bold', fontSize: '20px', color: calcularFinal(notasModulo) < 6 ? 'red' : 'blue' }}>{calcularFinal(notasModulo)}</Typography>
                    </Stack>
                </Stack>
            </>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline />
                <Waiting show={waiting} />
                {aluno && (
                    <>
                        <Typography variant="h4">{aluno.user.nome}</Typography>
                        <Typography variant="h6">{moment(aluno.data_nasc).format('LL')} ({idade} anos)</Typography>
                        <Divider />
                            <Box sx={{ margin: "25px" }}>
                                <Typography variant="body1" >
                                    Contatos:
                                    <Box sx={{ mt: 1 }}>
                                        <MdEmail /> <a href={`mailto:${aluno.user.email}`}>E-mail</a>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <FaWhatsapp /> <a href={`https://wa.me/${aluno.user.telefone}`}>WhatsApp</a>
                                    </Box>
                                </Typography>
                            </Box>
                        <Divider />
                        {aluno.resp_nome && (
                            <>
                            <Typography variant="h5">{aluno.resp_parent}: {aluno.resp_nome}</Typography>
                            <Typography variant="body1" >
                                Contatos:
                                <Box sx={{ mt: 1 }}>
                                    <MdEmail /> <a href={`mailto:${aluno.resp_email}`}>E-mail</a>
                                </Box>
                                <Box sx={{ mt: 1, mb: 1 }}>
                                    <FaWhatsapp /> <a href={`https://wa.me/${aluno.resp_telefone}`}>WhatsApp</a>
                                </Box>
                            </Typography>
                            <Divider />
                            </>
                        )}
                        <Button 
                            onClick={handleEnrollClick} 
                            variant="contained" 
                            color="secondary" 
                            size="large"
                            sx={{margin: '25px'}}
                            startIcon={<FaGraduationCap />}
                        >
                            Matricular
                        </Button>
                        <Dialog open={openEnrollDialog} onClose={() => setOpenEnrollDialog(false)}>
                            <DialogTitle>Matricular em um módulo</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Selecione o módulo no qual deseja matricular o aluno:
                                </DialogContentText>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedModulo}
                                        onChange={(e) => setSelectedModulo(e.target.value)}
                                    >
                                        {availableModulos
                                            .filter(modulo => modulo.active)
                                            .map(modulo => (
                                                <MenuItem key={modulo.id} value={modulo}>
                                                    <ListItemIcon>
                                                        <Avatar alt={modulo.curso.nome} src={modulo.curso.imageUrl} sx={{ width: 24, height: 24 }} />
                                                    </ListItemIcon>
                                                    <ListItemText>{modulo.titulo}</ListItemText>
                                                </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleEnrollConfirmation} color="primary">Matricular</Button>
                                <Button onClick={() => setOpenEnrollDialog(false)} color="secondary">Cancelar</Button>
                            </DialogActions>
                        </Dialog>

                        {matriculas.length > 0 && (
                            <>
                                <Typography variant="h5">Módulos Matriculados:</Typography>
                                {matriculas.map((matricula, index) => (
                                    <Accordion 
                                        key={index} 
                                        expanded={expandedAccordion === index} 
                                        onChange={() => handleAccordionChange(index)} 
                                        sx={{ 
                                            width: '100%',
                                            opacity: matricula.modulo.active ? 1 : 0.5,
                                            backgroundColor: matricula.modulo.active ? 'white' : '#f0f0f0'
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            {expandedAccordion === index ? (
                                                <MuiLink component={Link} to={`/modulo/${matricula.modulo.id}`} underline="none" color="inherit" style={{ width: '100%' }}>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar alt={matricula.modulo.curso.nome} src={matricula.modulo.curso.imageUrl} />
                                                        <Typography sx={{ ml: 2 }} variant="h5">{matricula.modulo.titulo}</Typography>
                                                    </Stack>
                                                </MuiLink>
                                            ) : (
                                                <>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar alt={matricula.modulo.curso.nome} src={matricula.modulo.curso.imageUrl} />
                                                        <Typography sx={{ ml: 2 }} variant="h5">{matricula.modulo.titulo}</Typography>
                                                    </Stack>
                                                </>
                                            )}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2 }}>
                                                {showNotas(aluno.presenca, aluno.notas, matricula)}
                                            </Stack>
                                        </AccordionDetails>
                                        <AccordionActions>
                                            <Button onClick={() => handleDeleteConfirmation(matricula.id)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Desmatricular</Button>
                                        </AccordionActions>
                                    </Accordion>
                                ))}
                                <Divider />
                            </>
                        )}
                    </>
                )}
            </Container>
        </ThemeProvider>
    )
}