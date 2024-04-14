import prisma from '../database/client.js'
import bcrypt from 'bcrypt'

const controller = {}

controller.create = async function (req, res) {
    try {
        const { nome, email, telefone, end_logr, end_num, end_compl, end_cid, end_estado, username, password, data_nasc } = req.body

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

        await prisma.aluno.create({ 
            data:  {
                data_nasc,
                user: {
                    connect: { id: newUser.id }
                }
            }
        })

        res.status(201).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.aluno.findMany({
            include: {
                user: true
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
        const result = await prisma.aluno.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                user: true
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
        const result = await prisma.aluno.update({
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
        const result = await prisma.aluno.delete({
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