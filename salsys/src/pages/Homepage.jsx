import React from 'react'
import myfetch from '../utils/myfetch';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import logo from '../assets/Sallogo.png';
import { Container, Paper, Typography, Button, IconButton, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack, List, ListItem, ListItemAvatar, ListItemText, Avatar, Pagination, PaginationItem, Grid, FormControl, Select, InputLabel, MenuItem, ListItemIcon, Link as MuiLink } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material'
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { useDropzone } from 'react-dropzone'
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

const localizer = momentLocalizer(moment);

const newsPerPage = 5;
const tipsPerPage = 7

export default function Homepage(){
    const [openNewsDialog, setOpenNewsDialog] = React.useState(false)
    const [news, setNews] = React.useState([])
    const [tips, setTips] = React.useState([])
    const [cursos, setCursos] = React.useState([])
    const [professores, setProfessores] = React.useState([])
    const [openTipsDialog, setOpenTipsDialog] = React.useState(false)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [currentPage2, setCurrentPage2] = React.useState(1)
    const [waiting, setWaiting] = React.useState(false)
    
    React.useEffect(() => {
        fetchNews()
    }, [currentPage])

    React.useEffect(() => {
        fetchTips()
    }, [currentPage2])

    React.useEffect(() => {
        if (openTipsDialog) {
            fetchCursos(),
            fetchProfs()
        }
    }, [openTipsDialog])

    const fetchNews = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get(`/news`)
            setNews(response)
            setWaiting(false)
        } catch (error) {
            console.error('Erro procurando notícias', error)
            setWaiting(false)
        }
    }

    const fetchTips = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get('/tips')

            const sortedResponse = response.slice().sort((a, b) => b.createdAt - a.createdAt)
            setTips(sortedResponse)
            setWaiting(false)
        } catch (error) {
            console.error('Erro procurando dicas', error)
            setWaiting(false)
        }
    }

    const deleteNews = async (id) => {
        if (confirm('Deseja realmente excluir esta notícia?')){
            try {
                setWaiting(true)
                await myfetch.delete(`/news/${id}`)

                fetchNews()
                setWaiting(false)
            } catch (error) {
                console.error('Erro deletando notícia: ', error)
                setWaiting(false)
            } 
        }
    }

    const deleteTip = async (id) => {
        if (confirm('Deseja realmente excluir esta dica/recurso?')){
            try {
                setWaiting(true)
                await myfetch.delete(`/tips/${id}`)

                fetchTips()
                setWaiting(false)
            } catch (error) {
                console.error('Erro deletando dica: ', error)
                setWaiting(false)
            } 
        }
    }

    const fetchCursos = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get(`/cursos`)
            setCursos(response)
            setWaiting(false)
        } catch (error) {
            console.error('Erro procurando cursos', error)
            setWaiting(false)
        }
    }

    const fetchProfs = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get(`/professores`)
            setProfessores(response)
            setWaiting(false)
        } catch (error) {
            console.error('Erro procurando cursos', error)
            setWaiting(false)
        }
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }

    const lastIndex = Math.min(currentPage * newsPerPage, news.length)
    const firstIndex = Math.max(lastIndex - newsPerPage, 0)
    const currentNews = news.slice(firstIndex, lastIndex)

    const handleOpenNewsDialog = () => {
        setOpenNewsDialog(true)
    }

    const handleCloseNewsDialog = () => {
        setOpenNewsDialog(false);
    };

    const AddNews = ({ open, handleClose }) => {
        const [newsText, setNewsText] = React.useState('')
        const [image, setImage] = React.useState(null)

        const onDrop = (acceptedFiles) => {
            setImage(acceptedFiles[0])
        }

        const { getRootProps, getInputProps } = useDropzone({ onDrop })

        const handleAddNews = async () => {

            const formData = new FormData()
            formData.append('texto', newsText)
            if (image) {
                formData.append('image', image)
            }

            try {
                setWaiting(true)
                const response = await myfetch.post('/news', formData)
                console.log('Notícia postada: ', response)
                fetchNews()
                setWaiting(false)
                handleCloseNewsDialog()
            } catch (error) {
                console.error('Erro postando notícia: ', error)
                setWaiting(false)
                handleCloseNewsDialog()
            }
        }

        return (
            <Dialog open={open} onClose={handleCloseNewsDialog}>
                <DialogTitle>Publicar uma Notícia</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Texto da noticia"
                        type="text"
                        fullWidth
                        multiline
                        value={newsText}
                        required
                        onChange={(e) => setNewsText(e.target.value)}
                    />
                    <div {...getRootProps()} style={{ border: '2px dashed #aaaaaa', padding: '20px', textAlign: 'center' }}>
                        <input {...getInputProps()} />
                        {image ? (
                            <p>Imagem selecionada; {image.name}</p>
                        ) : (
                            <p>Arraste uma imagem aqui, ou clique para selecionar</p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleAddNews}>Publicar</Button>
                    <Button variant='contained' color='secondary' onClick={handleCloseNewsDialog}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        )
    }

    const handlePageChange2 = (event, value) => {
        setCurrentPage2(value)
    }

    const lastIndex2 = Math.min(currentPage2 * tipsPerPage, tips.length)
    const firstIndex2 = Math.max(lastIndex2 - tipsPerPage, 0)
    const currentTips = tips.slice(firstIndex2, lastIndex2)

    const handleOpenTipsDialog = () => {
        setOpenTipsDialog(true)
    }

    const handleCloseTipsDialog = () => {
        setOpenTipsDialog(false);
    };

    const AddTips = ({ open, handleClose }) => {
        const [tipText, setTipText] = React.useState('')
        const [link, setLink] = React.useState('')
        const [curso, setCurso] = React.useState('')
        const [prof, setProf] = React.useState('')

        const handleAddTips = async () => {

            try {
                setWaiting(true)

                const response = await myfetch.post('/tips', {
                    texto: tipText,
                    linkUrl: link,
                    curso: { connect: { id: parseInt(curso) } },
                    professor: { connect: { id: parseInt(prof) } }
                })
                console.log('Dica postada: ', response)
                fetchTips()
                setWaiting(false)
                handleCloseTipsDialog()
            } catch (error) {
                console.error('Erro postando dica: ', error)
                setWaiting(false)
                handleCloseTipsDialog()
            }
        }

        return (
            <Dialog open={open} onClose={handleCloseTipsDialog}>
                <DialogTitle>Publicar uma Dica ou Recurso</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel id="curso-label">Curso</InputLabel>
                        <Select
                            labelId="curso-label"
                            id="curso-select"
                            required
                            value={curso}
                            onChange={(e) => setCurso(e.target.value)}
                        >
                            {cursos.map((curso) => (
                                <MenuItem key={curso.id} value={curso.id}>
                                    <ListItemIcon>
                                        <Avatar alt={curso.nome} src={curso.imageUrl} sx={{ width: 24, height: 24 }} />
                                    </ListItemIcon>
                                    <ListItemText>{curso.nome}</ListItemText>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel id="professor-label">Professor</InputLabel>
                        <Select
                            labelId="professor-label"
                            id="professor-select"
                            required
                            value={prof}
                            onChange={(e) => setProf(e.target.value)}
                        >
                            {professores.map((professor) => (
                                <MenuItem key={professor.id} value={professor.id}>{professor.user.nome}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Texto"
                        type="text"
                        fullWidth
                        multiline
                        rows={2}
                        value={tipText}
                        required
                        onChange={(e) => setTipText(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Link"
                        type="text"
                        fullWidth
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleAddTips}>Publicar</Button>
                    <Button variant='contained' color='secondary' onClick={handleCloseTipsDialog}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        )
    }

    const [events, setEvents] = React.useState([])

    React.useEffect(() => {
        fetchAniversarios()
        fetchEventos()
    }, [])

    const fetchAniversarios = async () => {
        try {
            setWaiting(true)
            const [profsResponse, alunosResponse] = await Promise.all([
                myfetch.get('/professores'),
                myfetch.get('/alunos')
            ])

            console.log(profsResponse)

            const profsAniver = profsResponse.map(prof => ({
                nome: prof.user.nome,
                data: moment(prof.data_nasc, 'YYYY-MM-DD').year(moment().year())
            }))


            const alunoAniver = alunosResponse.map(aluno => ({
                nome: aluno.user.nome,
                data: moment(aluno.data_nasc, 'YYYY-MM-DD').year(moment().year())
            }))

            const respAniver = alunosResponse
                .filter(aluno => aluno.resp_nome && aluno.resp_data_nasc)
                .map(aluno => ({
                    nome: aluno.resp_nome,
                    data: moment(aluno.resp_data_nasc, 'YYYY-MM-DD').year(moment().year())
                }))

            const aniversarios = [...profsAniver, ...alunoAniver, ...respAniver]


            const uniqueAniverMap =new Map()
            aniversarios.forEach(aniversario => {
                const key = aniversario.nome + aniversario.data.format('YYYY-MM-DD')
                if (!uniqueAniverMap.has(key)) {
                    uniqueAniverMap.set(key, aniversario)
                }
            })

            const uniqueAniver = Array.from(uniqueAniverMap.values())

            const aniverEvents = uniqueAniver.map(aniversario => ({
                title: aniversario.nome,
                start: aniversario.data.toDate(),
                end: aniversario.data.toDate(),
                type: 'aniversario'
            }))

            setEvents(prevEvents => [...prevEvents, ...aniverEvents])

            setWaiting(false)
        } catch (error) {
            console.error('Erro procurando aniversários: ', error)
            setWaiting(false)
        }
    }

    const fetchEventos = async () => {}

    return (
        <Container>
            <Waiting show={waiting} />
            <Box textAlign='center'>
                <img src={logo} alt="Logotipo SaL" style={{ width: '500px'}}/>
            </Box>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                        Notícias e Recados
                    </Typography>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <List>
                            {currentNews.map((news, index) => (
                                <React.Fragment key={news.id}>
                                    <ListItem>
                                        <Box sx={{ m: 2 }}>
                                            <Stack direction="row" spacing={3}>
                                                <Typography fontWeight='bold'>{moment(news.createdAt).format('l')}</Typography>
                                                <Stack direction="column" spacing={1}>
                                                    <Typography>{news.texto}</Typography>
                                                    {news.image && <img src={`data:image/png;base64,${news.image}`} alt="News" style={{ maxHeight: '300px' }} />}
                                                </Stack>
                                                
                                            </Stack>
                                        </Box>
                                        <IconButton color='error' onClick={() => deleteNews(news.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                        <Box sx={{ display: 'flex', justifyContent:'center', margin: 2 }}>
                            <Pagination
                                count={Math.ceil(news.length / newsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                                renderItem={(item) => (
                                    <PaginationItem {...item} />
                                )}
                            /> 
                        </Box>
                        <Box textAlign='center'>
                            <Button variant='contained' size='large' color='secondary' onClick={handleOpenNewsDialog} startIcon={<NewspaperIcon />} sx={{ mt: 2 }}>Postar</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                        Dicas e Recursos
                    </Typography>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <List>
                            {currentTips.map((tip, index) => (
                                <React.Fragment key={tip.id}>
                                    {tip.linkUrl ? (
                                        <ListItem>
                                            <Box sx={{ m: 2 }}>
                                                <MuiLink
                                                    component={Link}
                                                    to={tip.linkUrl}
                                                    underline='none'
                                                >
                                                    <Stack direction="row">
                                                        <ListItemAvatar>
                                                            <Avatar alt={tip.curso.nome} src={tip.curso.imageUrl}/>
                                                        </ListItemAvatar>
                                                        <Typography variant='h6' fontWeight={'bold'}>Recurso de {tip.curso.nome}</Typography>
                                                    </Stack>
                                                    <ListItemText
                                                        primary={tip.texto}
                                                        secondary={'Professor: ' + tip.professor.user.nome}
                                                    />
                                                </MuiLink>
                                                
                                            </Box>
                                            <IconButton color='error' onClick={() => deleteTip(tip.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    ) : (
                                        <ListItem>
                                            <Box sx={{ m: 2 }}>
                                                <Stack direction="row">
                                                    <ListItemAvatar>
                                                        <Avatar alt={tip.curso.nome} src={tip.curso.imageUrl}/>
                                                    </ListItemAvatar>
                                                    <Typography variant='h6' fontWeight={'bold'}>Dica de {tip.curso.nome}</Typography>
                                                </Stack>
                                                <ListItemText
                                                    primary={tip.texto}
                                                    secondary={'Professor: ' + tip.professor.user.nome}
                                                />
                                            </Box>
                                            <IconButton color='error' onClick={() => deleteTip(tip.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    )}
                                    
                                </React.Fragment>
                            ))}
                        </List>
                        <Box sx={{ display: 'flex', justifyContent:'center', margin: 2 }}>
                            <Pagination
                                count={Math.ceil(tips.length / tipsPerPage)}
                                page={currentPage2}
                                onChange={handlePageChange2}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                                renderItem={(item) => (
                                    <PaginationItem {...item} />
                                )}
                            /> 
                        </Box>
                        <Box textAlign='center'>
                            <Button variant='contained' size='large' color='secondary' onClick={handleOpenTipsDialog} startIcon={<TipsAndUpdatesIcon />} sx={{ mt: 2 }}>Postar</Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{ fontSize: 30, fontWeight: 'bold', mt: 2 }}>
                    Calendário de Eventos
                </Typography>
                <Paper elevation={3} sx={{padding: 2}}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />
                    <Box textAlign='center' mt={2}>
                        <Button variant='contained' size='large' color='secondary'>Novo Evento</Button>
                    </Box>
                </Paper>
            </Grid>
            <AddNews open={openNewsDialog} handleClose={handleCloseNewsDialog} />
            <AddTips open={openTipsDialog} handleClode={handleCloseTipsDialog} />
        </Container>
    )
}