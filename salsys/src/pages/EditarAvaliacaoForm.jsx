import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import myfetch from '../utils/myfetch';
import moment from 'moment';
import { Container, Typography, Box, TextField, Button, Divider, FormControl, FormGroup, Grid, Avatar, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/pt-br';
import Waiting from '../ui/Waiting';

export default function EditarAvaliacaoForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [avaliacao, setAvaliacao] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [notas, setNotas] = useState([]);
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        fetchAvaliacao();
    }, []);

    const fetchAvaliacao = async () => {
        try {
            setWaiting(true);
            const response = await myfetch.get(`/avaliacoes/${id}`);
            response.data = moment(response.data);
            setAvaliacao(response);
            setAlunos(response.notas.map(nota => nota.aluno).sort((a, b) => a.user.nome.localeCompare(b.user.nome)));
            setNotas(response.notas);
            setWaiting(false);
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar avaliação: ', error.message);
            setWaiting(false);
        }
    };

    const handleNotaChange = (alunoId) => (event) => {
        const nota = parseFloat(event.target.value);
        const updatedNotas = notas.map((notaItem) => {
            if (notaItem.aluno.id === alunoId) {
                return { ...notaItem, nota: nota };
            }
            return notaItem;
        });
        setNotas(updatedNotas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setWaiting(true);

            const notasData = notas.map(({ id, nota }) => ({ id, nota }))

            await myfetch.put(`/avaliacoes/${id}`, {
                titulo: avaliacao.titulo,
                data: avaliacao.data,
                peso: parseInt(avaliacao.peso),
                notas: {
                    updateMany: notasData.map(({ id, nota }) => ({
                        where: { id },
                        data: { nota }
                    }))
                },
            });

            setWaiting(false);
            alert('Avaliação atualizada com sucesso!');
            navigate(`/modulo/${avaliacao.moduloId}`);
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar avaliação: ', error.message);
            setWaiting(false);
        }
    };

    return (
        <Container>
            <Waiting show={waiting} />
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>Editar Avaliação</Typography>
            <Divider />
            {avaliacao && (
                <>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                        {avaliacao.modulo.curso && (
                            <Avatar alt={avaliacao.modulo.curso.nome} src={avaliacao.modulo.curso.imageUrl} />
                        )}
                        <Typography variant='h5'>{avaliacao.modulo.titulo}</Typography>
                    </Stack>
                    {avaliacao.professor && (
                        <Typography variant='h6' sx={{ mb: 2 }}>Professor: {avaliacao.professor.user.nome}</Typography>
                    )}
                    <Divider />
                    <form onSubmit={handleSubmit}>
                        <Typography sx={{ mt: 2 }}>Título da Avaliação:</Typography>
                        <TextField
                            variant="filled"
                            sx={{ backgroundColor: "white", color: "black" }}
                            value={avaliacao.titulo}
                            onChange={(e) => setAvaliacao(prevState => ({ ...prevState, titulo: e.target.value }))}
                        />
                        <Grid container spacing={2} sx={{ margin: 2 }}>
                            <Grid item xs={2}>
                                <Typography>Peso:</Typography>
                                <TextField
                                    type="number"
                                    variant="filled"
                                    sx={{ backgroundColor: "white", color: "black" }}
                                    inputProps={{ min: 1, max: 5 }}
                                    value={avaliacao.peso}
                                    onChange={(e) => setAvaliacao(prevState => ({ ...prevState, peso: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>Data de Aplicação:</Typography>
                                <LocalizationProvider dateAdapter={AdapterMoment} locale="pt-br">
                                    <DatePicker
                                        variant="filled"
                                        sx={{ backgroundColor: "white", color: "black" }}
                                        fullWidth
                                        value={avaliacao.data}
                                        onChange={(newValue) => setAvaliacao(prevState => ({ ...prevState, data: newValue }))}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography variant='h6' sx={{ margin: 2 }}>Registrar Notas:</Typography>
                        <FormGroup>
                            {alunos.map(aluno => (
                                <div key={aluno.id}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 2 }}>
                                        <FormControl>
                                            <TextField
                                                type="number"
                                                sx={{ backgroundColor: "white", color: "black", width: 100 }}
                                                size="small"
                                                inputProps={{ step: "0.05", min: 0, max: 10 }}
                                                value={notas.find(nota => nota.aluno.id === aluno.id)?.nota || 0}
                                                onChange={handleNotaChange(aluno.id)}
                                            />
                                        </FormControl>
                                        <Typography>{aluno.user.nome}</Typography>
                                    </Stack>
                                </div>
                            ))}
                        </FormGroup>
                        <Box>
                            <Button type="submit" variant="contained" sx={{ margin: 2 }}>Salvar Alterações</Button>
                            <Button type="button" variant="outlined" sx={{ margin: 2 }} onClick={() => navigate(`/modulo/${avaliacao.moduloId}`)}>Cancelar</Button>
                        </Box>
                    </form>
                </>
            )}
        </Container>
    )
}
