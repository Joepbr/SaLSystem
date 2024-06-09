import prisma from '../database/client.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const controller = {}

controller.create = async function (req, res) {
    try {

        if(req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 12)
        }

        await prisma.user.create({ data: req.body })

        res.status(201).end()
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const result = await prisma.user.findMany()

        for(let user of result) {
            if(user.password) delete user.password
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
        const result = await prisma.user.findUnique({
            where: { id: Number(req.params.id) }
        })

        if(result.password) delete result.password

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

        if(req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 12)
        }

        const result = await prisma.user.update({
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
        const result = await prisma.user.delete({
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

controller.login = async function(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { username: req.body?.username }
        })
        if(! user) return res.send(401).end()

        const passwordOk = await bcrypt.compare(req.body.password, user.password)
        if(! passwordOk) return res.send(401).end()

        if(user.password) delete user.password

        const token = jwt.sign(
            user,
            process.env.TOKEN_SECRET,
            { expiresIn: '730h' }
        )

        res.cookie(process.env.AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.send({ user})
    }
    catch(error) {
        console.log(error)

        res.status(500).end()
    }
}

controller.logout = function(req, res) {
    res.cookie(process.env.AUTH_COOKIE_NAME, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        maxAge: 10
    })

    res.status(204).end()
}

controller.me = function(req, res) {
    res.send(req.authUser)
}

export default controller