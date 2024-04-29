import prisma from '../database/client.js'
import bcrypt from 'bcrypt'

const controller = {}

controller.create = async function (req, res) {
    try {
        const { nome, email, telefone, end_logr, end_num, end_compl, end_cid, end_estado, username, password, data_nasc, resp_nome, resp_email, resp_telefone, resp_data_nasc, resp_parent } = req.body

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

        const aluno = await prisma.aluno.create({ 
            data:  {
                data_nasc,
                resp_nome,
                resp_email,
                resp_telefone,
                resp_data_nasc,
                resp_parent,
                user: {
                    connect: { id: newUser.id }
                }
            }
        })

        res.status(201).json(aluno)
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
                user: true,
                presenca: {
                    include: {
                        aula: {
                            include: {
                                modulo: {
                                    include: {
                                        avaliacao: true
                                    }
                                }
                            }
                        }
                    }
                },
                notas: {
                    include: {
                        avaliacao: {
                            include: {
                                modulo: true
                            }
                        }
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
        const moduloId = Number(req.params.moduloId);
        const result = await prisma.aluno.findMany({
            where: {
                matricula: {
                    some: {
                        moduloId: moduloId
                    }
                }
            },
            include: {
                user: true
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

controller.retrieveByAvaliacaoId = async function (req, res) {
    try {
        const avaliacaoId = Number(req.params.avaliacaoId);
        const result = await prisma.aluno.findMany({
            where: {
                notas: {
                    some: {
                        avaliacaoId: avaliacaoId
                    }
                }
            },
            include: {
                user: true,
                notas: true
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