import jwt from 'jsonwebtoken'

export default{
    sign: (payload) => jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'}),
    verify: (token) => jwt.verify(token, process.env.JWT_SECRET)
}