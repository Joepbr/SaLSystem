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
app.use('/curso', cursoRoute)

export default app;
