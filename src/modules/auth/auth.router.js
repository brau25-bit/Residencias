import {Router} from 'express'
import { AuthController } from './auth.controller.js'
import { validateSchema} from '../../middleware/validateSchema.js'
import { userSchema, partialUserSchema } from '../../schemas/users.schema.js'
import { limiter, loginLimiter, authLimiter } from '../../middleware/limiter.js'

const authRouter = Router()

authRouter.post('/login', loginLimiter, validateSchema(partialUserSchema), AuthController.login)
authRouter.post('/register', limiter, validateSchema(userSchema), AuthController.register)
authRouter.post('/recover-password', authLimiter, validateSchema(partialUserSchema), AuthController.recoverPassword)
authRouter.post('/reset-password', authLimiter, validateSchema(partialUserSchema), AuthController.resetPassword)
authRouter.post('/verify-account', authLimiter, AuthController.verifyAccount)

export default authRouter