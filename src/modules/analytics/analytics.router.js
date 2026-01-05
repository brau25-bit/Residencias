import { Router } from "express";
import { AnalyticsController } from "./analytics.controller.js";
import { limiter } from "../../middleware/limiter.js";
import { verifyToken } from "../../middleware/auth.js";
import { authorization } from "../../middleware/authorize.js";

const analyticsRouter = Router()

analyticsRouter.get('/report-by-status', limiter, verifyToken, authorization('ADMIN'), AnalyticsController.getReportsByStatus)

analyticsRouter.get('/report-by-category', limiter, verifyToken, authorization('ADMIN'), AnalyticsController.getReportsByCategory)

analyticsRouter.get('/report-over-time', limiter, verifyToken, authorization('ADMIN'), AnalyticsController.getReportsOverTime)

analyticsRouter.get('/report-heat-map', limiter, verifyToken, authorization('ADMIN'), AnalyticsController.getReportHeatMap)

analyticsRouter.get('/average-resolution-time', limiter, verifyToken, authorization('ADMIN'), AnalyticsController.getReportResolutionTime)

analyticsRouter.get('/time-per-status', AnalyticsController.getTimeByStatus)

analyticsRouter.get('/status-transitions', AnalyticsController.getStatusTransitions)

analyticsRouter.get('/generate-report-pdf', AnalyticsController.generateFullReportPDF)

export default analyticsRouter