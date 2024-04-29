import React from 'react'
import myfetch from '../utils/myfetch';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Divider, Avatar, List, ListItem, ListItemText, ListItemAvatar, Pagination, PaginationItem } from '@mui/material';
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
            const sortedResult = result.sort((a, b) => new Date(b.data) - new Date(a.data))
            setAulas(sortedResult)
            setWaiting(false)
        } catch (error) {
            console.error(error);
            alert('ERRO: ' + error.message);
        }
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }

    const lastIndex = Math.min(currentPage * aulasPerPage, aulas.length)
    const firstIndex = Math.max(lastIndex - aulasPerPage, 0)
    const currentAula = aulas.slice(firstIndex, lastIndex)

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
                Lista de Aulas Registradas no Sistema:
            </Typography>
            <Divider />
            <List dense>
                {currentAula.map((aula, index) => (
                    <React.Fragment key={aula.id}>
                        <ListItem
                            button
                            component={Link}
                            to={`/aula/${aula.id}`}
                            sx={{ borderBottom: index < currentAula.length - 1 ? '1px solid #ccc' : 'none' }}
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
            </List>
            <Box sx={{ display: 'flex', justifyContent:'center', margin: 2 }}>
                <Pagination
                    count={Math.ceil(aulas.length / aulasPerPage)}
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
        </Container>
    )
}