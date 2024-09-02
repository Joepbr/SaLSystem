import jwt from 'jsonwebtoken'

export default function(req, res, next) {
    const bypassRoutes = [
        { url: '/users/login', method: 'POST' },
        { url: '/users/send-email', method: 'POST'}
    ]

    for(let route of bypassRoutes) {
        if(route.url === req.url && route.method == req.method) {
            next()
            return
        }
    }

    let token = null

    token = req.cookies[process.env.AUTH_COOKIE_NAME]

    if(! token) {
        const authHeader = req.headers['authorization']

        if(! authHeader) {
            console.error('ERRO: Acesso negado por falta de token')
            return res.status(403).end()
        }

        const authHeaderParts = authHeader.split(' ')
        token = authHeaderParts[1]
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {

        if(error) return res.status(403).end()

       req.authUser = user

       next()
    })
}