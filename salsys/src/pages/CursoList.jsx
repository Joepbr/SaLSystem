import React from 'react'
import myfetch from '../utils/myfetch'


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
        <>
            <h1>Cursos oferecidos pela Escola:</h1>
            <p>{JSON.stringify(cursos)}</p>
        </>
    )
}