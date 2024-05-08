import React from 'react'
import myfetch from '../utils/myfetch';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import logo from '../assets/Sallogo.png';
import { Container, Paper, Typography, Button, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { useDropzone } from 'react-dropzone'
import Waiting from '../ui/Waiting';

moment.locale('pt-br');

const localizer = momentLocalizer(moment);

export default function Homepage(){
    const [openDialog, setOpenDialog] = React.useState(false)
    const [news, setNews] = React.useState([])
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            setWaiting(true)
            const response = await myfetch.get('/news')
            setNews(response)
            setWaiting(false)
        } catch (error) {
            console.error('Erro procurando notícias', error)
            setWaiting(false)
        }
    }

    const handleOpenDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
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
                console.log('Notícia postada', response)
                setWaiting(false)
                handleCloseDialog()
            } catch (error) {
                console.error('Erro postando notícia: ', error)
                setWaiting(false)
                handleCloseDialog()
            }
        }

        return (
            <Dialog open={open} onClose={handleCloseDialog}>
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
                    <div {...getRootProps()}>
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
                    <Button variant='contained' color='secondary' onClick={handleCloseDialog}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        )
    }

    return (
        <Container>
            <Waiting show={waiting} />
            <Box textAlign='center'>
                <img src={logo} alt="Logotipo SaL" style={{ width: '500px'}}/>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                Notícias e Recados
            </Typography>
            <Paper elevation={3} sx={{ padding: 2 }}>
                {news.map((item) => (
                    <div key={item.id}>
                        <Stack direction="row" spacing={3}>
                            <Typography fontWeight='bold'>{moment(item.createdAt).format('l')}</Typography>
                            <Typography>{item.texto}</Typography>
                        </Stack>
                        {item.imageUrl && <img src={item.imageUrl} alt="News" />}
                    </div>
                ))}
                <Box textAlign='center'>
                    <Button variant='contained' size='large' color='secondary' onClick={handleOpenDialog} startIcon={<NewspaperIcon />}>Postar</Button>
                </Box>
            </Paper>
            <AddNews open={openDialog} handleClose={handleCloseDialog} />
        </Container>
    )
}