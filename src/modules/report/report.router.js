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

reportRouter.patch('/:id', limiter, verifyToken, authorization('USER'), validateSchema(partialReportSchema), ReportController.updateReports)

reportRouter.patch('/:id/delete', verifyToken, authorization('USER', 'ADMIN'), ReportController.deleteReports)

reportRouter.patch('/:id/status', verifyToken, authorization('ADMIN'), validateSchema(partialReportSchema), ReportController.updateReportsStatus)

reportRouter.post('/', limiter, verifyToken, authorization('USER'), validateSchema(reportSchema), ReportController.createReports)

/*

// gestion de estados - historial de los reportes
reportRouter.get('/:id/history')


*/

export default reportRouter