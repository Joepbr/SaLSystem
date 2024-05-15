import prisma from '../database/client.js'
import { drive } from '../index.js'
import { transformImageUrl } from '../utils/helpers.js';

const transformCursoData = (curso) => {
    return {
        ...curso,
        imageUrl: transformImageUrl(curso.imageUrl)
    }
}

const controller = {}

controller.create = async function (req, res) {
    try {
        const curso = await prisma.curso.create({ data: req.body })

        res.status(201).json(transformCursoData(curso))
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.curso.findMany()

        //Transform imageUrl for each course
        const transformedResult = result.map(transformCursoData)

        res.json(transformedResult)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.curso.findUnique({
            where: { id: Number(req.params.id) }
        })

        if (result) {
            res.json(transformCursoData(result))
        } else {
            res.status(404).end()
        }

        //if(result) res.json(result)
        //else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.update = async function (req, res) {
    try {
        const result = await prisma.curso.update({
            where: { id: Number(req.params.id) },
            data: req.body
        })

        if(result) res.status(204).json(transformCursoData(result))
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.delete = async function (req, res) {
    try {
        const result = await prisma.curso.delete({
            where: { id: Number(req.params.id) }
        })

        if(result) res.status(204).end()
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

export default controller