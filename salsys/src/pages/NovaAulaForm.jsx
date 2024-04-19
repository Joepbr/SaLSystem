import React from 'react';
import myfetch from '../utils/myfetch';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Container, Typography, TextField, Button, Divider, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';


export default function NovaAulaForm() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [aula, setAula] = React.useState({
        data: moment(),
        conteudo: '',
        moduloId: id,
        professorId: ''
    })
    const [profs, setProfs] = React.useState([])
    const [alunos, setAlunos] = React.useState([])

    React.useEffect(() => {
        fetchProfs()
        fetchAlunos()
    }, [])

    const fetchProfs = async () => {
        try {
            const response = await myfetch.get('/professores')
            setProfs(response)
        } catch (error) {
            console.error('Erro lendo dados dos professores: ', error)
        }
    }

    const fetchAlunos = async () => {
        try {
            const response = await myfetch.get(`/alunos/modulo/${id}`)
            setAlunos(response)
        } catch (error) {
            console.error('Erro lendo dados dos alunos: ', error)
        }
    }
    
    return (
        <>
            <h1>Registrar Aula no Sistema</h1>
            <Typography>Professor:</Typography>
            <FormControl fullWidth>
                <Select 
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    value={aula.professorId ? aula.professorId : ''} 
                    onChange={(e) => setAula(prevState => ({
                        ...prevState,
                        professorId: e.target.value
                    }))} 
                    required
                >
                    {profs.map((profs) => (
                        <MenuItem key={profs.id} value={profs.id}>
                            {profs.user.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <p>{JSON.stringify(alunos)}</p>
        </>
    )
}