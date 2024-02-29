import React from 'react'
import myfetch from '../utils/myfetch'

export default function AlunosList(){
    const [alunos, setAlunos] = React.useState([])

    //useEffect com vetor de dependências vazio é executado apenas uma vez,
    //na fase mount do ciclo de vida do componente
    React.useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const result = await myfetch.get('alunos')
            setAlunos(result)
        }
        catch(error) {
            //deu errado
            console.error(error)
            alert('ERRO: ' + error.message)
        }
    }

    return (
        <>
            <h1>Listagem de alunos</h1>
            <p>{JSON.stringify(alunos)}</p>
        </>
    )
}