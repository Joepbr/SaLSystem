import prisma from '../database/client.js'

const controller = {}

controller.create = async function (req, res) {
    try {
        const avaliacao = await prisma.avaliacao.create({ data: req.body })

        res.status(201).json(avaliacao)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.avaliacao.findMany()

        res.send(result)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.avaliacao.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                notas: {
                    include: {
                        aluno: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                modulo: {
                    include: {
                        curso: true
                    }
                },
                professor: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if(result) res.send(result)
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveByModuloId = async function (req, res) {
    try {
        const moduloId = Number(req.params.moduloId)
        const result = await prisma.avaliacao.findMany({
            where: {
                moduloId: moduloId
            }
        })
        if(result) res.send(result)
        else res.status(404).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.update = async function (req, res) {
    try {
        const result = await prisma.avaliacao.update({
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
        const result = await prisma.avaliacao.delete({
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