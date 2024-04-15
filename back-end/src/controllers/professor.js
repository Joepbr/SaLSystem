import prisma from '../database/client.js'
import bcrypt from 'bcrypt'

const controller = {}

controller.create = async function (req, res) {
    try {
        const { nome, email, telefone, end_logr, end_num, end_compl, end_cid, end_estado, username, password, data_nasc, especialidade, imageUrl  } = req.body

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = await prisma.user.create({
            data: {
                nome,
                email,
                telefone,
                end_logr,
                end_num,
                end_compl,
                end_cid,
                end_estado,
                username,
                password: hashedPassword
            }
        })

        const professor = await prisma.professor.create({ 
            data:  {
                data_nasc,
                especialidade,
                imageUrl,
                user: {
                    connect: { id: newUser.id }
                }
            }
        })

        res.status(201).json(professor)
    }
    catch(error) {
        console.error('Erro ao cadastrar professor', error)

        res.status(500).send({ error: 'Internal server error' })
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.professor.findMany({
            include: {
                user: true
            }
        })
        for(let user of result) {
            if(user.user.password) delete user.user.password
        }

        res.send(result)
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.professor.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                user: true
            }
        })
        if(result.user.password) delete result.user.password

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
        const result = await prisma.professor.update({
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
        const result = await prisma.professor.delete({
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