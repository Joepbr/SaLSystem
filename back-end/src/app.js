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

/**Session Middleware**/
import session from "express-session";
import crypto from 'crypto';

app.use(session({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false
}));
/*********************/

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

import aulaRoute from './routes/aula.js'
app.use('/aulas', aulaRoute)

import matriculaRoute from './routes/matricula.js'
app.use('/matriculas', matriculaRoute)

import presencaRoute from './routes/presenca.js'
app.use('/presencas', presencaRoute)

import avaliacaoRoute from './routes/avaliacao.js'
app.use('/avaliacoes', avaliacaoRoute)

import notasRoute from './routes/notas.js'
app.use('/notas', notasRoute)

import disponibilidadeRoute from './routes/disponibilidade.js'
app.use('/disponibilidade', disponibilidadeRoute)

/**************************************/
import driveRoute from './routes/drive.js'
app.use('/drive', driveRoute)

import newsRoute from './routes/news.js'
app.use('/news', newsRoute)

import tipsRoute from './routes/tips.js'
app.use('/tips', tipsRoute)

import eventoRoute from './routes/evento.js'
app.use('/eventos', eventoRoute)

export default app;
