import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Container, Box, Typography, TextField, Button, Divider, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import myfetch from '../utils/myfetch';
import InputMask from 'react-input-mask'
import Waiting from '../ui/Waiting';

export default function EditarAlunoForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [aluno, setAluno] = React.useState({
        nome: '',
        email: '',
        telefone: '',
        end_logr: '',
        end_num: '',
        end_compl: '',
        end_cid: '',
        end_estado: '',
        data_nasc: moment(),
        resp_nome: '',
        resp_email: '',
        resp_telefone: '',
        resp_data_nasc: moment(),
        resp_parent: ''
    })
    const [idade, setIdade] = React.useState(null)
    const [waiting, setWaiting] = React.useState(false)

    React.useEffect(() =>{
        const today = moment()
        const alunoIdade = today.diff(aluno.data_nasc, 'years')
        setIdade(parseInt(alunoIdade))
    }, [aluno.data_nasc])

    React.useEffect(() => {
        const fetchAlunoData = async () => {
            try {
                setWaiting(true)
                const alunoData = await myfetch.get(`/alunos/${id}`);
                const userData = await myfetch.get(`/users/${id}`)

                alunoData.data_nasc = moment(alunoData.data_nasc);

                alunoData.resp_data_nasc = moment(aluno.resp_data_nasc)

                const combinedData = { ...alunoData, ...userData}

                setAluno(combinedData);
                setWaiting(false)
            } catch (error) {
                console.error('Erro ao ler dados do aluno:', error);
            }
        };

        fetchAlunoData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setWaiting(true)
            const dateOfBirth = new Date(aluno.data_nasc)

            const formattedDateOfBirth = dateOfBirth.toISOString()

            const endNumInteger = parseInt(aluno.end_num, 10);

            const rawTelefone = aluno.telefone.replace(/\D/g, '')
            
            const rawRespTelefone = idade < 18 ? aluno.resp_telefone.replace(/\D/g, '') : null

            const dateOfBirth2 = new Date(aluno.resp_data_nasc)

            const formattedDateOfBirth2 = dateOfBirth2.toISOString()

            setAluno({
                ...aluno,
                telefone: rawTelefone,
                end_num: endNumInteger,
                data_nasc: formattedDateOfBirth,
                resp_telefone: rawRespTelefone,
                resp_data_nasc: formattedDateOfBirth2
            })

            const response1 = await myfetch.put(`/alunos/${id}`, {
                data_nasc: formattedDateOfBirth,
                resp_nome: idade < 18 ? aluno.resp_nome : null,
                resp_email: idade < 18 ? aluno.resp_email : null,
                resp_telefone: idade < 18 ? rawRespTelefone : null,
                resp_data_nasc: idade < 18 ? formattedDateOfBirth2 : null,
                resp_parent: idade < 18 ? aluno.resp_parent : null
            });

            const response2 = await myfetch.put(`/users/${aluno.id}`, {
                nome: aluno.nome,
                email: aluno.email,
                telefone: rawTelefone,
                end_logr: aluno.end_logr,
                end_num: endNumInteger,
                end_compl: aluno.end_compl,
                end_cid: aluno.end_cid,
                end_estado: aluno.end_estado,
            })
            
            console.log('Dados do aluno editados com sucesso:', response1, response2);
            setWaiting(false)
            navigate('/alunos');
    
        } catch (error) {

            console.error('Erro ao cadastrar aluno:', error);
        }
    };

    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
        'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Editar Aluno</Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <Typography>Nome do Aluno*: </Typography>
                <TextField
                    name="nome"
                    variant="filled"
                    sx={{backgroundColor: "white", color: "black"}}
                    margin="normal"
                    fullWidth
                    value={aluno.nome}
                    onChange={(e) => setAluno({...aluno, nome: e.target.value})}
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
                    value={aluno.email}
                    onChange={(e) => setAluno({...aluno, email: e.target.value})}
                    required
                />
                <Divider />
                <Typography>Telefone de Contato (WhatsApp)*: </Typography>
                <InputMask
                    mask="+55 (99) 99999 9999"
                    value={aluno.telefone}
                    onChange={(e) => setAluno({...aluno, telefone: e.target.value})}
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
                            name="logradouro"
                            label="Logradouro"
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black", margin: "10px", flexGrow: 3}}
                            margin="normal"
                            fullWidth
                            value={aluno.end_logr}
                            onChange={(e) => setAluno({...aluno, end_logr: e.target.value})}
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
                            value={aluno.end_num}
                            onChange={(e) => setAluno({...aluno, end_num: e.target.value})}
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
                            value={aluno.end_compl}
                            onChange={(e) => setAluno({...aluno, end_compl: e.target.value})}
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
                        value={aluno.end_cid}
                        onChange={(e) => setAluno({...aluno, end_cid: e.target.value})}
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
                            value={aluno.end_estado}
                            onChange={(e) => setAluno({...aluno, end_estado: e.target.value})}
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
                    {moment.isMoment(aluno.data_nasc) ? (
                        <DatePicker
                            variant="filled"
                            sx={{backgroundColor: "white", color: "black"}}
                            margin="normal"
                            fullWidth
                            value={aluno.data_nasc}
                            onChange={(newValue) => setAluno({...aluno, data_nasc: newValue})}
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
                {idade < 18 &&(
                    <>
                        <Typography>Nome do Responsável*:</Typography>
                        <TextField
                            name="nome_responsavel"
                            variant="filled"
                            sx={{ backgroundColor: "white", color: "black" }}
                            margin="normal"
                            fullWidth
                            value={aluno.resp_nome}
                            onChange={(e) => setAluno({...aluno, resp_nome: e.target.value})}
                            required
                        />
                        <Divider />
                    </>
                )}
                {idade < 18 &&(
                    <>
                        <Typography>E-mail do Responsável*:</Typography>
                        <TextField
                            name="email_responsavel"
                            variant="filled"
                            sx={{ backgroundColor: "white", color: "black" }}
                            margin="normal"
                            fullWidth
                            value={aluno.resp_email}
                            onChange={(e) => setAluno({...aluno, resp_email: e.target.value})}
                            required
                        />
                        <Divider />
                    </>
                )}
                {idade < 18 &&(
                    <>
                        <Typography>Telefone do Responsável (WhatsApp)*:</Typography>
                        <InputMask
                            mask="+55 (99) 99999 9999"
                            value={aluno.resp_telefone}
                            onChange={(e) => setAluno({...aluno, resp_telefone: e.target.value})}
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
                    </>
                )}
                {idade < 18 &&(
                    <>
                    <Typography>Data de Nascimento do Responsável*:</Typography>
                    <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                        {moment.isMoment(aluno.resp_data_nasc) ? (
                            <DatePicker
                                variant="filled"
                                sx={{backgroundColor: "white", color: "black"}}
                                margin="normal"
                                fullWidth
                                value={aluno.resp_data_nasc}
                                onChange={(newValue) => setAluno({...aluno, resp_data_nasc: newValue})}
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
                </>
                )}
                {idade < 18 &&(
                    <>
                        <Typography>Grau de Parentesco do Responsável*:</Typography>
                        <TextField
                            name="paarentesco_responsavel"
                            variant="filled"
                            sx={{ backgroundColor: "white", color: "black" }}
                            margin="normal"
                            fullWidth
                            value={aluno.resp_parent}
                            onChange={(e) => setAluno({...aluno, resp_parent: e.target.value})}
                            required
                        />
                        <Divider />
                    </>
                )}
                <Box sx={{ padding: '10px' }}>
                    <Button type="submit" variant="contained" color="primary">Confirmar</Button>
                </Box>
                <Box sx={{ padding: '10px' }}>
                    <Button type="button" variant="outlined" onClick={() => navigate('/alunos')}>Cancelar</Button>
                </Box>
            </form>
        </Container>
    );
}