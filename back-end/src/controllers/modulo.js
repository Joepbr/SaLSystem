import prisma from '../database/client.js'

const controller = {}

controller.create = async function (req, res) {
    try {
        const { dias_sem, ...moduloData } = req.body

        const modulo = await prisma.modulo.create({ 
            data: {
                ...moduloData,
                dias_sem: {
                    createMany: {
                        data: dias_sem.map(dia => ({ dia }))
                    }
                }
            } 
        })

        res.status(201).json(modulo)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.modulo.findMany({
            include: {
                dias_sem: true
            }
        })

        res.send(result)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.modulo.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                dias_sem: true
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

controller.retrieveByCourseId = async function (req, res) {
    try {
        const cursoId = Number(req.params.cursoId);
        const result = await prisma.modulo.findMany({
            where: {
                cursoId: cursoId
            },
            include: {
                dias_sem: true
            }
        });

        if(result) res.send(result)
        else res.status(404).end()
    }
    catch (error) {
        console.log(error);

        res.status(500).end();
    }
}

controller.retrieveByProfId = async function (req, res) {
    try {
        const profId = Number(req.params.id);
        const result = await prisma.modulo.findMany({
            where: {
                profId: profId
            },
            include: {
                dias_sem: true
            }
        });

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
        const moduloId = Number(req.params.id)
        const { dias_sem, ...moduloData } = req.body

        const result = await prisma.modulo.update({
            where: { id: moduloId },
            data: {
                ...moduloData,
                dias_sem: {
                    deleteMany: {},
                    createMany: {
                        data: dias_sem.map(dia => ({ dia }))
                    }
                }
            }
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
        const moduloId = Number(req.params.id)

        const result = await prisma.modulo.deleteMany({
            where: { id: moduloId }
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