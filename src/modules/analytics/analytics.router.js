import { Router } from "express";

const analyticsRouter = Router()

/* 
GET /api/analytics/reports-by-status - Cuenta por estado
GET /api/analytics/reports-by-category - Cuenta por categoría
GET /api/analytics/reports-over-time - Serie temporal de creación
GET /api/analytics/heatmap - Coordenadas para mapa de calor


📝 Endpoints para gráficas basadas en ReportStatusHistory:

GET /api/analytics/average-resolution-time - Tiempo promedio de resolución
GET /api/analytics/time-per-status - Tiempo promedio en cada estado
GET /api/analytics/technician-performance - Reportes atendidos por técnico
GET /api/analytics/status-transitions - Análisis de transiciones (cancelaciones, etc.)
*/

export default analyticsRouter