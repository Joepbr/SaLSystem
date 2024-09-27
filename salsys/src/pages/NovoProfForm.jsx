import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Container, Box, Typography, TextField, Button, Divider, Grid, Select, MenuItem, FormControl, InputLabel, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import myfetch from '../utils/myfetch';
import InputMask from 'react-input-mask'
import Waiting from '../ui/Waiting';

export default function CreateTeacherForm() {
    const navigate = useNavigate();
    const [teacherData, setTeacherData] = React.useState({
        nome: '',
        email: '',
        telefone: '',
        end_logr: '',
        end_num: '',
        end_compl: '',
        end_cid: '',
        end_estado: '',
        username: '',
        password: '',
        data_nasc: moment(),
        especialidade: '',
        imageUrl: ''
    });

    const [imageFile, setImageFile] = React.useState(null)
    const [showPassword, setShowPassword] = React.useState(false)
    const [waiting, setWaiting] = React.useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacherData({ ...teacherData, [name]: value });
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleFileChange = async (e) => {
        setImageFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            setWaiting(true)
            const dateOfBirth = new Date(teacherData.data_nasc)

            const formattedDateOfBirth = dateOfBirth.toISOString()

            const endNumInteger = parseInt(teacherData.end_num, 10);

            const rawTelefone = teacherData.telefone.replace(/\D/g, '')

            let imageUrl = teacherData.imageUrl
            if (imageFile) {
                const formData = new FormData()
                formData.append('image', imageFile)

                const response = await myfetch.post('/api/upload', formData)
                imageUrl = response.imageUrl

                setTeacherData(prevState => ({
                    ...prevState,
                    imageUrl: imageUrl
                }))
            }

            const response = await myfetch.post('/professores', {
                nome: teacherData.nome,
                email: teacherData.email,
                telefone: rawTelefone,
                end_logr: teacherData.end_logr,
                end_num: endNumInteger,
                end_compl: teacherData.end_compl,
                end_cid: teacherData.end_cid,
                end_estado: teacherData.end_estado,
                username: teacherData.username,
                password: teacherData.password,
                data_nasc: formattedDateOfBirth,
                especialidade: teacherData.especialidade,
                imageUrl: imageUrl
            });
            
            console.log('Professor cadastrado:', response);
            setWaiting(false)
            navigate('/profs')
        } catch (error) {

            console.error('Erro ao cadastrar professor:', error);
        }
    };

    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
        'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Cadastrar Novo Professor</Typography>
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
                <Typography>Telefone de Contato*: </Typography>
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
                <Typography>Nome de Usuário*: </Typography>
                <TextField
                    name="username"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={teacherData.username}
                    onChange={handleChange}
                    required
                />
                <Divider />
                <Typography>Criar Senha*: </Typography>
                <TextField
                    name="password"
                    variant="filled"
                    type={showPassword ? 'text' : 'password'}
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={teacherData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                        endAdornment: 
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleShowPassword}
                                edge="end"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                            </InputAdornment>
                        }}
                />
                <Divider />
                <Typography>Data de Nascimento: </Typography>
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
                    name="imagem"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    onChange={handleFileChange}
                />
                <Box sx={{ padding: '10px' }}>
                    <Button type="submit" variant="contained" color="primary">Cadastrar Professor</Button>
                </Box>
                <Box sx={{ padding: '10px' }}>
                    <Button type="button" variant="outlined" onClick={() => navigate('/profs')}>Cancelar</Button>
                </Box>
            </form>
        </Container>
    );
}
