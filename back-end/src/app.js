import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

/*********************
Rotas de API
*********************/

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

export default app;
