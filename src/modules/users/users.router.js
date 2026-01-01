import { Router } from "express";
import { partialUserSchema } from "../../schemas/users.schema.js";
import { validateSchema } from "../../middleware/validateSchema.js";
import { authorization } from "../../middleware/authorize.js";
import { verifyToken } from "../../middleware/auth.js";
import { limiter } from "../../middleware/limiter.js";
import { UserController } from "./users.controller.js";

const usersRouter = Router()

usersRouter.get('/', limiter, verifyToken, authorization('ADMIN'), UserController.getUsers)

usersRouter.get('/:id', limiter, verifyToken, authorization('ADMIN'), UserController.getUserById)

usersRouter.patch('/:id/ban',  limiter, verifyToken, authorization('ADMIN'), validateSchema(partialUserSchema), UserController.banUser)

usersRouter.patch('/:id/unban',  limiter, verifyToken, authorization('ADMIN'), UserController.unbanUser)

usersRouter.patch('/:id/toggle-report',  limiter, verifyToken, authorization('ADMIN'), UserController.toggleReportUser)

usersRouter.patch('/:id/role',  limiter, verifyToken, authorization('ADMIN'), validateSchema(partialUserSchema), UserController.changeUserRole)

export default usersRouter