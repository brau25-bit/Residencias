import {Router} from 'express'
import { AuthController } from './auth.controller.js'
import { validateSchema} from '../../middlewares/validateSchema.js'
import { userSchema, partialUserSchema } from '../../schemas/users.schema.js'

const {login, register, recoverPassword, verifieAccount} = AuthController

const authRouter = Router()

authRouter.use('/login', validateSchema(partialUserSchema), login)
authRouter.use('/register', validateSchema(userSchema), register)
authRouter.use('/recover-password', validateSchema(partialUserSchema), recoverPassword)
authRouter.use('/verifie-account', validateSchema(partialUserSchema), verifieAccount)

export default authRouter