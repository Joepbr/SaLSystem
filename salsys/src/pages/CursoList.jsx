import React from 'react'
import myfetch from '../utils/myfetch'

import { Button, CssBaseline, Box, Typography, Container, ThemeProvider, Divider } from '@mui/material';
import theme from '../utils/theme';


export default function Cursos(){
    const [cursos, setCursos] = React.useState([])

    //useEffect com vetor de dependências vazio é executado apenas uma vez,
    //na fase mount do ciclo de vida do componente
    React.useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const result = await myfetch.get('/cursos')
            setCursos(result)
        }
        catch(error) {
            //deu errado
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline>
                    <Typography
                        sx={{
                            fontSize: 30,
                            fontWeight: 'bold'
                          }}
                    >
                        Cursos oferecidos pela Escola:
                    </Typography>
                    <Divider>
                    <Box
                    sx={{
                        width: '100vw',
                        backgroundColor:"#ffffff"
                    }}
                    >
                    {JSON.stringify(cursos)}
                    </Box>
                    </Divider>
                </CssBaseline>
            </Container>
        </ThemeProvider>
    )
}