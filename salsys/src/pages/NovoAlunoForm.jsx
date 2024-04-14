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
import IMask from 'imask';

export default function NovoAlunoForm() {
    const navigate = useNavigate();
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [telefone, setTelefone] = React.useState('');
    const [end_logr, setEnd_logr] = React.useState('');
    const [end_num, setEnd_num] = React.useState('');
    const [end_compl, setEnd_compl] = React.useState('');
    const [end_cid, setEnd_cid] = React.useState('');
    const [end_estado, setEnd_estado] = React.useState('');
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [data_nasc, setData_nasc] = React.useState(moment())
    
    const [showPassword, setShowPassword] = React.useState(false)

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !email || !telefone || !end_logr || !end_num || !end_cid || !end_estado || !username || !password || !data_nasc ) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    
        try {
            const dateOfBirth = new Date(data_nasc)

            const formattedDateOfBirth = dateOfBirth.toISOString()

            const endNumInteger = parseInt(end_num, 10);

            const rawTelefone = telefone.replace(/\D/g, '')

            const response = await myfetch.post('/alunos', {
                nome,
                email,
                telefone: rawTelefone,
                end_logr,
                end_num: endNumInteger,
                end_compl,
                end_cid,
                end_estado,
                username,
                password,
                data_nasc: formattedDateOfBirth,
            });
            
            if (response.status === 201) {
                console.log('Aluno cadastrado:', response);
                navigate('/alunos');
            } else {
                console.error('Erro ao cadastrar aluno:', response.statusText);
            }
    
        } catch (error) {

            console.error('Erro ao cadastrar aluno:', error);
        }
    };

    const telefoneInputRef = React.useRef(null);

    React.useEffect(() => {
        if (telefoneInputRef.current) {
            IMask(telefoneInputRef.current, {
                mask: '+{55} (00) 00000-0000'
            });
        }
    }, []);

    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
        'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <Container>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Cadastrar Novo Aluno</Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <Typography>Nome do Aluno*: </Typography>
                <TextField
                    name="nome"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Divider />
                <Typography>Telefone de Contato*: </Typography>
                <TextField
                    inputRef={telefoneInputRef}
                    name="telefone"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                />
                <Divider />
                <Typography>Endereço: </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            name="logradouro"
                            label="Logradouro"
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black", margin: "10px", flexGrow: 3}}
                            margin="normal"
                            fullWidth
                            value={end_logr}
                            onChange={(e) => setEnd_logr(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            name="número"
                            label="Número"
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black", margin: "10px"}}
                            margin="normal"
                            fullWidth
                            value={end_num}
                            onChange={(e) => setEnd_num(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            name="complemento"
                            label="Complemento"
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black", margin: "10px"}}
                            margin="normal"
                            fullWidth
                            value={end_compl}
                            onChange={(e) => setEnd_compl(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Box>
                    <TextField
                        name="cidade"
                        label="Cidade"
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black", margin: "10px"}}
                        margin="normal"
                        value={end_cid}
                        onChange={(e) => setEnd_cid(e.target.value)}
                        required
                    />
                    <FormControl>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            name="estado"
                            label="Estado"
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black", margin: "10px"}}
                            margin="normal"
                            value={end_estado}
                            onChange={(e) => setEnd_estado(e.target.value)}
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <Typography>Data de Nascimento*: </Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                        {moment.isMoment(data_nasc) ? (
                            <DatePicker
                                variant="filled"
                                sx={{backgroundColor: "white", color: "black"}}
                                margin="normal"
                                fullWidth
                                value={data_nasc}
                                onChange={(newValue) => setData_nasc(newValue)}
                            >
                                <TextField
                                    variant="filled"
                                />
                            </DatePicker>
                        ) : (
                            <div>Carregando...</div>
                        )}
                    </LocalizationProvider>
                <Box sx={{ padding: '10px' }}>
                    <Button type="submit" variant="contained" color="primary">Cadastrar Aluno</Button>
                </Box>
                <Box sx={{ padding: '10px' }}>
                    <Button type="button" variant="outlined" onClick={() => navigate('/alunos')}>Cancelar</Button>
                </Box>
            </form>
        </Container>
    );
}