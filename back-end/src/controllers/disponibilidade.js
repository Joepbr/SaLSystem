import prisma from '../database/client.js'

const controller = {}

controller.create = async function (req, res) {
    try {
        const disponibilidade = await prisma.disponibilidade.create({ data: req.body })

        res.status(201).json(disponibilidade)
    }
    catch(error) {
        console.error('Erro criando disponibilidade: ', error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const disponibilidades = await prisma.disponibilidade.findMany()

        res.json(disponibilidades)
    }
    catch(error) {
        console.error('Erro lendo disponibilidades: ', error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const id = Number(req.params.id)
        const disponibilidade = await prisma.disponibilidade.findUnique({ where: { id } })

        if(disponibilidade) {
            res.json(disponibilidade)
        } else {
            res.status(404).end()
        }
    }
    catch(error) {
        console.error('Erro lendo disponibilidade: ', error)

        res.status(500).end()
    }
}

controller.retrieveByProfId = async function (req, res) {
    try {
        const profId = Number(req.params.profId)
        const disponibilidades = await prisma.disponibilidade.findMany({
            where: { profId }
        })
        res.json(disponibilidades)
    }
    catch (error) {
        console.error('Erro lendo disponibilidades: ', error)
        
        res.status(500).end
    }
}

controller.update = async function (req, res) {
    try {
        const id = Number(req.params.id)
        const disponibilidade = await prisma.disponibilidade.update({
            where: { id },
            data: req.body,
        })

        if(disponibilidade) {
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    }
    catch(error) {
        console.error('Erro editando disponibilidade: ', error)

        res.status(500).end()
    }
}

controller.delete = async function (req, res) {
    try {
        const id = Number(req.params.id)
        const disponibilidade = await prisma.disponibilidade.delete({ where: { id } })

        if(disponibilidade) {
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    }
    catch(error) {
        console.error('Erro deletando disponibilidade', error)

        res.status(500).end()
    }
}

export default controller