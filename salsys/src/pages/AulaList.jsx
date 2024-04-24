import React from 'react'
import myfetch from '../utils/myfetch';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Divider, Avatar, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import moment from 'moment';
import Waiting from '../ui/Waiting';

const aulasPerPage = 15

export default function Aulas(){
    const [aulas, setAulas] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(1)
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchData();
    }, [currentPage]);

    async function fetchData() {
        try {
            setWaiting(true)
            const result = await myfetch.get('/aulas')
            result.sort((a, b) => new Date(b.data) - new Date(a.data))
            setAulas(result)
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    }

    const lastIndex = currentPage * aulasPerPage
    const firstIndex = lastIndex - aulasPerPage
    const currentAula = aulas.slice(firstIndex, lastIndex)

    const paginate = pageNumber => setCurrentPage(pageNumber)

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                Lista de Aulas Registradas no Sistema:
            </Typography>
            <Divider />
            <List dense>
                {aulas.map((aula, index) => (
                    <React.Fragment key={aula.id}>
                        <ListItem
                            button
                            component={Link}
                            to={`/aula/${aula.id}`}
                            sx={{ borderBottom: index < aulas.length - 1 ? '1px solid #ccc' : 'none' }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt={aula.modulo.curso.nome}
                                    src={aula.modulo.curso.imageUrl}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={moment(aula.data).format('L') + ' - ' + aula.modulo.titulo + ' - Aula ' + aula.num}
                                primaryTypographyProps={{
                                    fontSize: 20,
                                    fontWeight: 'medium'
                                }}
                                secondary={'Professor: ' + aula.professor.user.nome}
                            />
                        </ListItem>
                    </React.Fragment>
                ))}
                <Box sx={{ margin: 2 }}>
                    <ul>
                        {Array.from({ length: Math.ceil(aulas.length / aulasPerPage) }, (_, i) => (
                            <li key={i}>
                                <button onClick={() => paginate(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul> 
                </Box>
            </List>
        </Container>
    )
}