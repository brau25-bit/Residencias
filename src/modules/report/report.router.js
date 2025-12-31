import {Router} from 'express'
import {reportSchema, partialReportSchema } from '../../schemas/reports.schema.js'
import { validateSchema } from '../../middleware/validateSchema.js'
import { limiter } from '../../middleware/limiter.js'
import {ReportController} from "./report.controlller.js"
import { verifyToken } from '../../middleware/auth.js'
import { authorization } from "../../middleware/authorize.js"

const reportRouter = Router()

reportRouter.get('/', verifyToken, ReportController.getReports)
reportRouter.get('/:id', verifyToken, ReportController.getReportsByID)

reportRouter.patch('/:id', verifyToken, authorization('USER'), validateSchema(partialReportSchema), ReportController.updateReports)

reportRouter.post('/', limiter, verifyToken, authorization('USER'), validateSchema(reportSchema), ReportController.createReports)

/*

// gestion de estados - historial de los reportes
reportRouter.get('/:id/history')
reportRouter.patch('/:id/status')

reportRouter.delete('/:id')
*/

export default reportRouter