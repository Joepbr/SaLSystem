import React, { useContext } from 'react'
import myfetch from '../utils/myfetch'
import AuthUserContext from '../contexts/AuthUserContext';

import { ThemeProvider, Container, CssBaseline, Typography, Divider, Button, Box, Accordion, AccordionSummary, AccordionDetails, Avatar, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, AccordionActions, Stack, Link as MuiLink } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaChalkboardTeacher } from "react-icons/fa";

import { Link } from 'react-router-dom'
import theme from '../utils/theme';
import Waiting from '../ui/Waiting';


export default function Profs(){
    const { authUser } = useContext(AuthUserContext)
    const [profs, setProfs] = React.useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [profToDelete, setProfToDelete] = React.useState(null)
    const [expandedAccordion, setExpandedAccordion] = React.useState(null)
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setWaiting(true)
            const result = await myfetch.get('/professores')
            result.sort((a, b) => a.user.nome.localeCompare(b.user.nome))
            setProfs(result)
            setWaiting(false)
        }
        catch(error) {
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    const handleAccordionChange = (index) => {
        setExpandedAccordion(expandedAccordion === index ? null : index);
    }

    const handleDeleteConfirmation = (profs, event) => {
        if (event) {
            event.preventDefault()
        }
        setProfToDelete(profs)
        setOpenDeleteDialog(true)
    }

    const handleDelete = async () => {
        if (profToDelete) {
            try {
                setWaiting(true)
                await myfetch.delete(`/professores/${profToDelete.id}`);
                await myfetch.delete(`/users/${profToDelete.id}`)
                setOpenDeleteDialog(false)
                fetchData()
                setWaiting(false)
            } catch (error) {
                console.error(error)
                alert('ERRO: '+ error.message)
            }
        }
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline>
                    <Waiting show={waiting} />
                    <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                        Lista de Professores da Escola:
                    </Typography>
                    <Divider />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 2, marginBottom: 2}}>
                        {profs.map((prof, index) => (
                            <Accordion key={index} expanded={expandedAccordion === index} onChange={() => handleAccordionChange(index)} sx={{ width: '100%' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    {expandedAccordion === index ? (
                                        <MuiLink component={Link} to={`/prof/${prof.id}`} underline="none" color="inherit" style={{ width: '100%' }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar alt={prof.user.nome} src={prof.imageUrl} sx={{ width: 56, height: 56 }} />
                                                <Typography sx={{ ml: 2 }} variant="h5">{prof.user.nome}</Typography>
                                            </Stack>
                                        </MuiLink> 
                                    ) : (
                                        <>
                                            <Avatar alt={prof.user.nome} src={prof.imageUrl} />
                                            <Typography sx={{ ml: 2 }} variant="h5">{prof.user.nome}</Typography>
                                        </>
                                    )}
                                    
                                </AccordionSummary>
                                <AccordionDetails sx={{ flexDirection: 'column', padding: 1, marginLeft: 5 }}>
                                    <Typography>{prof.especialidade}</Typography>
                                </AccordionDetails>
                                {authUser?.is_admin && (
                                    <AccordionActions sx={{padding: 1}}>
                                        <Button component={Link} to={`/prof/${prof.id}/edit`} variant="outlined" size="small" startIcon={<EditIcon />}>Editar</Button>
                                        <Button onClick={(event) => handleDeleteConfirmation(prof, event)} variant="outlined" size="small" startIcon={<DeleteIcon />}>Deletar</Button>
                                    </AccordionActions>
                                )}
                            </Accordion>
                        ))}
                    <Divider />
                    </Box>
                    <Box display="flex">
                        {authUser?.is_admin && (
                            <Button 
                                component={Link} 
                                to="/profs/new" 
                                variant="contained" 
                                size="large"
                                sx={{ backgroundColor: "#9d2f2e" }}
                                startIcon={<FaChalkboardTeacher/>}
                            > 
                                Novo Professor 
                            </Button>
                        )} 
                    </Box>
                    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                        <DialogTitle>Remover Professor</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Tem certeza que você deseja remover o(a) professor(a) "{profToDelete ? profToDelete.user.nome : ''}"?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDelete} sx={{backgroundColor: "#9d2f2e", color: "white"}}>
                                Deletar
                            </Button>
                            <Button onClick={handleCloseDeleteDialog} sx={{backgroundColor: "#25254b", color: "white"}}>
                                Cancelar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </CssBaseline>
            </Container>
        </ThemeProvider>
    )
}