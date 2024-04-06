import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import dotenv from 'dotenv'
dotenv.config()

import indexRouter from "./routes/index.js";

import cors from 'cors'

const app = express();

/******CORS******/
app.use(cors({
    origin: process.env.FRONT_END_URL.split(','),
    credentials: true,
  }));
/******CORS******/

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

/*********************
Rotas de API
*********************/
/*
//Middleware que protege as rotas com autenticação
import auth from './middleware/auth.js'
app.use(auth)
*/
import cursoRoute from './routes/curso.js'
app.use('/cursos', cursoRoute)

import userRoute from './routes/user.js'
app.use('/users', userRoute)

import moduloRoute from './routes/modulo.js'
app.use('/modulos', moduloRoute)

import professorRoute from './routes/professor.js'
app.use('/professores', professorRoute)

import alunoRoute from './routes/aluno.js'
app.use('/alunos', alunoRoute)

import responsavelRoute from './routes/responsavel.js'
app.use('/responsaveis', responsavelRoute)

import aulaRoute from './routes/aula.js'
app.use('/aulas', aulaRoute)

import matriculaRoute from './routes/matricula.js'
app.use('/matriculas', matriculaRoute)

import presencaRoute from './routes/presenca.js'
app.use('/presencas', presencaRoute)

import avaliacaoRoute from './routes/avaliacao.js'
app.use('/avaliacoes', avaliacaoRoute)

import disponibilidadeRoute from './routes/disponibilidade.js'
app.use('/disponibilidade', disponibilidadeRoute)

export default app;
