import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Divider, Grid, Select, MenuItem, Box, InputLabel, FormControl } from '@mui/material';
import myfetch from '../utils/myfetch';
import IMask from 'imask';

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

    function formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('pt-BR', options);
    }    

    React.useEffect(() => {
        const fetchTeacherData = async () => {
            try {

                const userData = await myfetch.get(`/professores/${id}`);
                const professorData = await myfetch.get(`/users/${id}`)
                const combinedData = { ...userData, ...professorData}

                combinedData.data_nasc = new Date(combinedData.data_nasc)

                setTeacherData(combinedData);

            } catch (error) {
                console.error('Erro ao ler dados do professor:', error);
            }
        };

        fetchTeacherData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const endNumInteger = parseInt(teacherData.end_num)

            const dataNascISO = teacherData.data_nasc.toISOString()
    
            console.log('Teacher data before submission:', teacherData);

            setTeacherData({
                ...teacherData,
                end_num: endNumInteger,
                data_nasc: dataNascISO
            })

            const response1 = await myfetch.put(`/professores/${id}`, {
                data_nasc: dataNascISO,
                especialidade: teacherData.especialidade,
                imageUrl: teacherData.imageUrl
            });

            const response2 = await myfetch.put(`/users/${teacherData.id}`, {
                nome: teacherData.nome,
                email: teacherData.email,
                telefone: teacherData.telefone,
                end_logr: teacherData.end_logr,
                end_num: endNumInteger,
                end_compl: teacherData.end_compl,
                end_cid: teacherData.end_cid,
                end_estado: teacherData.end_estado
            })

            console.log('Dados do professor editados com sucesso:', response1, response2);
            navigate('/profs');
        } catch (error) {
            console.error('Erro ao editar dados do professor:', error);
        }
    };

    const dataNascInputRef = React.useRef(null);

    React.useEffect(() => {
        const dataNascMask = IMask(dataNascInputRef.current, {
            mask: Date,
            pattern: 'd{.}`m{.}`Y',
            lazy: false,
            onAccept: function () {
                setTeacherData({...teacherData, data_nasc: this.value});
            },
            onAcceptDone: function () {
                this.updateValue()
            }
        });

        return () => {
            dataNascMask.destroy();
        };
    }, []);

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
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Editar Professor</Typography>
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
                        value={teacherData.nome}
                        onChange={(e) => setTeacherData({...teacherData, nome: e.target.value})}
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
                        value={teacherData.email}
                        onChange={(e) => setTeacherData({...teacherData, email: e.target.value})}
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
                        value={teacherData.telefone}
                        onChange={(e) => setTeacherData({...teacherData, telefone: e.target.value})}
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
                                value={teacherData.end_logr}
                                onChange={(e) => setTeacherData({...teacherData, end_logr: e.target.value})}
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
                                value={teacherData.end_num}
                                onChange={(e) => setTeacherData({...teacherData, end_num: e.target.value})}
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
                                value={teacherData.end_compl}
                                onChange={(e) => setTeacherData({...teacherData, end_compl: e.target.value})}
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
                            value={teacherData.end_cid}
                            onChange={(e) => setTeacherData({...teacherData, end_cid: e.target.value})}
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
                                value={teacherData.end_estado}
                                onChange={(e) => setTeacherData({...teacherData, end_estado: e.target.value})}
                                required
                            >
                                {estados.map((estado) => (
                                    <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Divider />
                    <Typography>Data de Nascimento: </Typography>
                    <TextField
                        inputRef={dataNascInputRef}
                        name="data de nascimento"
                        label="Data de nascimento"
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        margin="normal"
                        fullWidth
                        value={teacherData.data_nasc instanceof Date ? teacherData.data_nasc.toLocaleDateString('pt-BR') : ''}
                        onChange={(e) => {

                        }}
                        onBlur={(e) => {
                            const inputDate = e.target.value;
                            console.log('Input date:', inputDate);
                            const [day, month, year] = inputDate.split('.');
                            console.log('Day:', day);
                            console.log('Month:', month);
                            console.log('Year:', year);
                            const parsedDate = new Date(`${year}-${month}-${day}`);
                            console.log('Parsed date:', parsedDate);
                            setTeacherData({...teacherData, data_nasc: parsedDate});
                        }}
                        onFocus={() => {
                            if (dataNascInputRef.current && dataNascInputRef.current.input) {
                                dataNascInputRef.current.input.value = formatDate(teacherData.data_nasc);
                                dataNascInputRef.current.updateValue();
                            }
                        }}
                        required
                    />
                    <Divider />
                    <Typography>Idiomas e Matérias que Leciona: </Typography>
                    <TextField
                        name="idiomas e matérias"
                        label="Idiomas e matérias"
                        variant="filled"
                        sx={{backgroundColor: "white", color: "black"}}
                        margin="normal"
                        fullWidth
                        value={teacherData.especialidade}
                        onChange={(e) => setTeacherData({...teacherData, especialidade: e.target.value})}
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
                        value={teacherData.imageUrl}
                        onChange={(e) => setTeacherData({...teacherData, imageUrl: e.target.value})}
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