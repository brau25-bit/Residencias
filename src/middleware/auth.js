import jwt from '../util/jwt.js'

export async function verifyToken(req, res, next){
    try {

        const authHeader = req.headers.authorization
        if(!authHeader) return res.status(401).json({message: 'Token no proporcionado'})

        const token = req.headers.authorization.split(' ')[1]
        if(!authHeader) return res.status(401).json({message: 'Token no proporcionado'})

        const decodedToken = jwt.verify(token)

        req.user = decodedToken

        next()
    } catch (error) {
        res.status(401).json({
        message: 'Token invalido'
        });
    }
}