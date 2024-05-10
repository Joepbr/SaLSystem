import prisma from '../database/client.js'

const controller = {}

controller.post = async function (req, res) {
    try {
        const tip = await prisma.tip.create({ data: req.body })

        res.status(201).json(tip)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.tip.findMany({
            include: {
                curso: true,
                professor: {
                    include: {
                        user: true
                    }
                }
            }
        })

        res.send(result)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.delete = async function (req, res) {
    try {
        const result = await prisma.tip.delete({
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