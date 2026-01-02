import { Router } from "express";
import { AnalyticsController } from "./analytics.controller.js";
import { limiter } from "../../middleware/limiter.js";
import { verifyToken } from "../../middleware/auth.js";
import { authorization } from "../../middleware/authorize.js";

const analyticsRouter = Router()

analyticsRouter.get('/report-by-status', limiter, verifyToken, authorization('ADMIN'), AnalyticsController.getReportsByStatus)

analyticsRouter.get('/report-by-category', AnalyticsController.getReportsByCategory)

analyticsRouter.get('/report-over-time', AnalyticsController.getReportsOverTime)

analyticsRouter.get('/report-heat-map', AnalyticsController.getReportHeatMap)

analyticsRouter.get('/reports-over-time', AnalyticsController.getReportResolutionTime)

/*
GET /api/analytics/reports-over-time - Serie temporal de creación
GET /api/analytics/heatmap - Coordenadas para mapa de calor


📝 Endpoints para gráficas basadas en ReportStatusHistory:

GET /api/analytics/average-resolution-time - Tiempo promedio de resolución
GET /api/analytics/time-per-status - Tiempo promedio en cada estado
GET /api/analytics/technician-performance - Reportes atendidos por técnico
GET /api/analytics/status-transitions - Análisis de transiciones (cancelaciones, etc.)

2025-05-25 17:43:10.924

2025-03-16 13:01:22.167
*/

export default analyticsRouter