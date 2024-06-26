import prisma from '../database/client.js'
import { transformImageUrlsInObject } from '../utils/helpers.js'

const controller = {}

controller.create = async function (req, res) {
    try {
        const matricula = await prisma.matricula.create({ data: req.body })

        res.status(201).json(matricula)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.matricula.findMany()

        res.send(result)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.matricula.findUnique({
            where: { id: Number(req.params.id) }
        })

        if(result) res.send(result)
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveByAlunoId = async function (req, res) {
    try {
        const alunoId = Number(req.params.id);
        const result = await prisma.matricula.findMany({
            where: {
                alunoId: alunoId
            },
            include: {
                modulo: {
                    include: {
                        curso: true,
                        aula: true,
                        avaliacao: {
                            include: {
                                notas: true
                            }
                        }
                    }
                }
            }
        });

        const transformedResult = transformImageUrlsInObject(result)

        if(transformedResult) res.send(transformedResult)
        else res.status(404).end()
    }
    catch (error) {
        console.log(error);

        res.status(500).end();
    }
}

controller.update = async function (req, res) {
    try {
        const result = await prisma.matricula.update({
            where: { id: Number(req.params.id) },
            data: req.body
        })

        if(result) res.status(204).end()
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.delete = async function (req, res) {
    try {
        const result = await prisma.matricula.delete({
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