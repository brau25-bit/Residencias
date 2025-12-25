import express from 'express'
import authRouter from './src/modules/auth/auth.router.js'
import 'dotenv/config'

const app = express()

app.disable('x-powered-by')
app.use(express.json())

app.use('/api/v1/auth', authRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`listening on port: http://localhost:${PORT}`)
})