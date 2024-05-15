import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Container, Typography, TextField, Button, Divider, Grid, Select, MenuItem, Box, InputLabel, FormControl } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import myfetch from '../utils/myfetch';
import InputMask from 'react-input-mask'
import Waiting from '../ui/Waiting';

export default function EditTeacherForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [teacherData, setTeacherData] = React.useState({
        nome: '',
        email: '',
        telefone: '',
        end_logr: '',
        end_num: '',
        end_compl: '',
        end_cid: '',
        end_estado: '',
        data_nasc: '',
        especialidade: '',
        imageUrl: ''
    });
    const [imageFile, setImageFile] = React.useState(null)
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() => {
        fetchTeacherData();
    }, [id]);

    const fetchTeacherData = async () => {
        try {
            setWaiting(true)
            const professorData = await myfetch.get(`/professores/${id}`);
            const userData = await myfetch.get(`/users/${id}`)

            professorData.data_nasc = moment(professorData.data_nasc);

            const combinedData = { ...professorData, ...userData}

            setTeacherData(combinedData);
            setWaiting(false)
        } catch (error) {
            console.error('Erro ao ler dados do professor:', error);
            setWaiting(false)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacherData({ ...teacherData, [name]: value });
    };

    const handleFileChange = async (e) => {
        setImageFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setWaiting(true)
            const endNumInteger = parseInt(teacherData.end_num)

            const dataNascISO = teacherData.data_nasc.toISOString()
    
            const rawTelefone = teacherData.telefone.replace(/\D/g, '')

            let imageUrl = teacherData.imageUrl
            if (imageFile) {
                const formData = new FormData()
                formData.append('image', imageFile)

                const response = await myfetch.post('/api/upload', formData)
                imageUrl = response.imageUrl
            }

            console.log('Teacher data before submission:', teacherData);

            setTeacherData({
                ...teacherData,
                telefone: rawTelefone,
                end_num: endNumInteger,
                data_nasc: dataNascISO,
                imageUrl: imageUrl
            })

            const response1 = await myfetch.put(`/professores/${id}`, {
                data_nasc: dataNascISO,
                especialidade: teacherData.especialidade,
                imageUrl: teacherData.imageUrl
            });

            const response2 = await myfetch.put(`/users/${teacherData.id}`, {
                nome: teacherData.nome,
                email: teacherData.email,
                telefone: rawTelefone,
                end_logr: teacherData.end_logr,
                end_num: endNumInteger,
                end_compl: teacherData.end_compl,
                end_cid: teacherData.end_cid,
                end_estado: teacherData.end_estado
            })

            console.log('Dados do professor editados com sucesso:', response1, response2);
            setWaiting(false)
            navigate('/profs');
        } catch (error) {
            console.error('Erro ao editar dados do professor:', error);
        }
    };

    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
        'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Editar Professor</Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <Typography>Nome do Professor*: </Typography>
                    <TextField
                        name="nome"
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        margin="normal"
                        fullWidth
                        value={teacherData.nome}
                        onChange={handleChange}
                        required
                    />
                    <Divider />
                    <Typography>E-mail de Contato*: </Typography>
                    <TextField
                        name="email"
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        margin="normal"
                        fullWidth
                        value={teacherData.email}
                        onChange={handleChange}
                        required
                    />
                    <Divider />
                    <Typography>Telefone de Contato (WhatsApp)*: </Typography>
                    <InputMask
                        mask="+55 (99) 99999 9999"
                        value={teacherData.telefone}
                        onChange={handleChange}
                    >
                        { () => <TextField
                            name="telefone"
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            margin="normal"
                            fullWidth
                            required
                        />
                        }
                    </InputMask>
                    <Divider />
                    <Typography>Endereço: </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
                                name="end_logr"
                                label="Logradouro"
                                variant="filled"
                                sx={{backgroundColor: "white", color: "black", margin: "10px", flexGrow: 3}}
                                margin="normal"
                                fullWidth
                                value={teacherData.end_logr}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="end_num"
                                label="Número"
                                variant="filled"
                                sx={{backgroundColor: "white", color: "black", margin: "10px"}}
                                margin="normal"
                                fullWidth
                                value={teacherData.end_num}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="end_compl"
                                label="Complemento"
                                variant="filled"
                                sx={{backgroundColor: "white", color: "black", margin: "10px"}}
                                margin="normal"
                                fullWidth
                                value={teacherData.end_compl}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Box>
                        <TextField
                            name="end_cid"
                            label="Cidade"
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black", margin: "10px"}}
                            margin="normal"
                            value={teacherData.end_cid}
                            onChange={handleChange}
                            required
                        />
                        <FormControl>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                name="end_estado"
                                label="Estado"
                                variant="filled"
                                sx={{backgroundColor: "white", color: "black", margin: "10px"}}
                                margin="normal"
                                value={teacherData.end_estado}
                                onChange={handleChange}
                                required
                            >
                                {estados.map((estado) => (
                                    <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Divider />
                    <Typography>Data de Nascimento*: </Typography>
                    <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                        {moment.isMoment(teacherData.data_nasc) ? (
                            <DatePicker
                                variant="filled"
                                sx={{backgroundColor: "white", color: "black"}}
                                margin="normal"
                                fullWidth
                                value={teacherData.data_nasc}
                                onChange={(newValue) => setTeacherData({...teacherData, data_nasc: newValue})}
                            >
                                <TextField
                                    variant="filled"
                                />
                            </DatePicker>
                        ) : (
                            <div>Carregando...</div>
                        )}
                    </LocalizationProvider>
                    <Divider />
                    <Typography>Idiomas e Matérias que Leciona*: </Typography>
                    <TextField
                        name="especialidade"
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        margin="normal"
                        fullWidth
                        value={teacherData.especialidade}
                        onChange={handleChange}
                        required
                    />
                    <Divider />
                    <Typography>Foto: </Typography>
                    <TextField
                        type="file"
                        name="image"
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        margin="normal"
                        fullWidth
                        onChange={handleFileChange}
                    />
                    <Box sx={{ padding: '10px' }}>
                        <Button type="submit" variant="contained" color="primary">Confirmar</Button>
                    </Box>
                    <Box sx={{ padding: '10px' }}>
                        <Button type="button" variant="outlined" onClick={() => navigate('/profs')}>Cancelar</Button>
                    </Box>
            </form>
        </Container>
    );
}