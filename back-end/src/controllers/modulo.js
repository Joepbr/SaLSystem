import prisma from '../database/client.js'
import { transformImageUrlsInObject } from '../utils/helpers.js'

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
                dias_sem: true,
                curso: true
            }
        })

        const transformedResult = transformImageUrlsInObject(result)

        res.send(transformedResult)
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
                dias_sem: true,
                curso: true,
                professor: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (result.professor.user.password) delete result.professor.user.password

        const transformedResult = transformImageUrlsInObject(result)

        if(transformedResult) res.send(transformedResult)
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
                dias_sem: true,
                curso: true,
                professor: {
                    include: {
                        user: true
                    }
                },
            }
        });

        for(let user of result) {
            if(user.professor.user.password) delete user.professor.user.password
        }

        const transformedResult = transformImageUrlsInObject(result)

        if(transformedResult) res.send(transformedResult)
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
                dias_sem: true,
                curso: true,
                professor: {
                    include: {
                        user: true
                    }
                }
            }
        });

        for(let user of result) {
            if(user.professor.user.password) delete user.professor.user.password
        }

        const transformedResult = transformImageUrlsInObject(result)

        if(transformedResult) res.send(transformedResult)
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
        const result = await prisma.modulo.findMany({
            where: {
                avaliacao: {
                    some: {
                        id: avaliacaoId
                    }
                }
            },
            include: {
                dias_sem: true,
                curso: true,
                professor: {
                    include: {
                        user: true
                    }
                },
            }
        });

        for(let user of result) {
            if(user.professor.user.password) delete user.professor.user.password
        }

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

controller.checkAccess = async function (req, res) {
    try {
        const moduloId = Number(req.params.id)
        const userId = req.authUser.id

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                professor: {
                    include: {
                        modulo: true
                    }
                },
                aluno: {
                    include: {
                        matricula: {
                            include: {
                                modulo: true
                            }
                        }
                    }
                }
            }
        })

        if (!user) return res.status(404).end()
        
        const isProfessor = user.professor?.modulo.some(c => c.id === moduloId)
        const isAluno = user.aluno?.matricula.modulo.some(c => c.id === moduloId)

        if (isProfessor || isAluno || user.is_admin) {
            return res.send({ hasAccess: true })
        } else {
            return res.send({ hasAccess: false })
        }
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

export default controller