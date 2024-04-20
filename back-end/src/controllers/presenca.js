import prisma from '../database/client.js'

const controller = {}

controller.create = async function (req, res) {
    try {
        const presenca = await prisma.presenca.create({ data: req.body })

        res.status(201).json(presenca)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.presenca.findMany()

        res.send(result)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.presenca.findUnique({
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
        const alunoId = Number(req.params.id)
        const result = await prisma.presenca.findMany({
            where: {
                alunoId: alunoId
            }
        })
        if(result) res.send(result)
        else res.status(404).end()
    }
    catch (error) {
        console.log(error);

        res.status(500).end();
    }
}

controller.update = async function (req, res) {
    try {
        const result = await prisma.presenca.update({
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
        const result = await prisma.presenca.delete({
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

controller.deleteByAulaId = async function (req, res) {
    try {
        const aulaId = Number(req.params.id)
        const result = await prisma.presenca.deleteMany({
            where: {
                aulaId: aulaId
            }
        })
        if(result.count > 0){
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

export default controller