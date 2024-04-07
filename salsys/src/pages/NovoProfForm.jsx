import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Container, Box, Typography, TextField, Button, Divider, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import myfetch from '../utils/myfetch';
import IMask from 'imask';

export default function CreateTeacherForm() {
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
    const [especialidade, setEspecialidade] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !email || !telefone || !end_logr || !end_num || !end_cid || !end_estado || !username || !password || !data_nasc || !especialidade) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    
        try {
            const dateOfBirth = new Date(data_nasc)

            const formattedDateOfBirth = dateOfBirth.toISOString()

            const endNumInteger = parseInt(end_num, 10);

            const response = await myfetch.post('/professores', {
                nome,
                email,
                telefone,
                end_logr,
                end_num: endNumInteger,
                end_compl,
                end_cid,
                end_estado,
                username,
                password,
                data_nasc: formattedDateOfBirth,
                especialidade,
                imageUrl
            });
            
            console.log('Professor cadastrado:', response);
            navigate('/profs')
        } catch (error) {

            console.error('Erro ao cadastrar professor:', error);
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
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Cadastrar Novo Professor</Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <Typography>Nome do Professor: </Typography>
                <TextField
                    name="nome"
                    label="Nome"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                <Divider />
                <Typography>E-mail de Contato: </Typography>
                <TextField
                    name="email"
                    label="Email"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Divider />
                <Typography>Telefone de Contato: </Typography>
                <TextField
                    inputRef={telefoneInputRef}
                    name="telefone"
                    label="Telefone"
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
                            name="endereço"
                            label="Endereço"
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
                <Typography>Nome de Usuário: </Typography>
                <TextField
                    name="username"
                    label="Usuário"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Divider />
                <Typography>Criar Senha: </Typography>
                <TextField
                    name="password"
                    label="Senha"
                    variant="filled"
                    type="password"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Divider />
                <Typography>Data de Nascimento: </Typography>
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
                <Divider />
                <Typography>Idiomas e Matérias que Leciona: </Typography>
                <TextField
                    name="idiomas e matérias"
                    label="Idiomas e matérias"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={especialidade}
                    onChange={(e) => setEspecialidade(e.target.value)}
                    required
                />
                <Divider />
                <Typography>Foto: </Typography>
                <TextField
                    name="imagem"
                    label="URL da imagem"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
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
