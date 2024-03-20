import jwt from 'jsonwebtoken'

export default function(req, res, next) {
    const bypassRoutes = [
        { url: '/users/login', method: 'POST' }
    ]

    for(let route of bypassRoutes) {
        if(route.url === req.url && route.method == req.method) {
            next()
            return
        }
    }

    const authHeader = req.headers['authoization']

    if(! authHeader) return res.status(403).end()

    const authHeaderParts = authHeader.split(' ')
    const token = authHeaderParts[1]

    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {

        if(error) return res.status(403).end()

       req.authUser = user

       next()
    })
}