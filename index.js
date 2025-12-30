import express from 'express'
import authRouter from './src/modules/auth/auth.router.js'
import reportRouter from './src/modules/report/report.router.js'
import 'dotenv/config'

const app = express()

app.disable('x-powered-by')
app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/reports', reportRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`listening on port: http://localhost:${PORT}`)
})