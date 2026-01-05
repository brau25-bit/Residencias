import { AnalyticsService } from "./analytics.service.js";

export class AnalyticsController{
    static async getReportsByStatus(req, res){
        try {
            const {startDate, endDate} = req.query

            const result = await AnalyticsService.getReportsByStatus({
                startDate, endDate
            })

            return res.status(200).json({
                message: "Datos obtenidos correctamente",
                ...result
            })
        } catch (error) {
            return res.status(400).json({message: error.message})
        }
    }

    static async getReportsByCategory(req, res){
        try {
            const {startDate, endDate} = req.query

            const result = await AnalyticsService.getReportsByCategory({
                startDate, endDate
            })

            return res.status(200).json({
                message: "Datos obtenidos correctamente",
                ...result
            })
        } catch (error) {
            
        }
    }

    static async getReportsOverTime(req, res){
        try {
            const {period, startDate, endDate} = req.query

            const validPeriods = ['day', 'week', 'month']
            if (period && !validPeriods.includes(period)) {
                return res.status(400).json({
                    message: 'Período inválido. Usa: day, week o month'
                })
            }

            const result = await AnalyticsService.getReportsOverTime({
                period: period || 'day',
                startDate,
                endDate
            })

            return res.status(200).json({
                message: 'Reportes a lo largo del tiempo obtenidos exitosamente',
                ...result
            })
        } catch (error) {
            console.error("Error in getReportsOverTime controller:", error)
            return res.status(500).json({
                message: 'Error al obtener reportes a lo largo del tiempo'
            })
        }
    }

    static async getReportHeatMap(req, res){
        try {
            const {status, category, startDate, endDate} = req.query

            if (status) {
                const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({
                        message: 'Estado inválido'
                    })
                }
            }

            if (category) {
                const validCategories = [
                    'ROAD_ISSUE',
                    'GRAFFITI',
                    'ILLEGAL_DUMPING',
                    'STREET_LIGHT_ISSUE',
                    'OTHER'
                ]
                if (!validCategories.includes(category)) {
                    return res.status(400).json({
                        message: 'Categoría inválida'
                    })
                }
            }

            const result = await AnalyticsService.getReportHeatMap({
                status,
                category,
                startDate,
                endDate
            })

            return res.status(200).json({
                message: 'Datos del mapa de calor obtenidos exitosamente',
                ...result
            })
        } catch (error) {
            
        }
    }

    static async getReportResolutionTime(req, res){
        try {
            const {startDate, endDate} = req.query

            const result = await AnalyticsService.getReportResolutionTime({
                startDate, endDate
            })

            return res.status(200).json({
                message: 'Tiempo promedio de resolución obtenido exitosamente',
                ...result
            })
        } catch (error) {
            
        }
    }

    static async getTimeByStatus(req, res){
        try {
            const {category, startDate, endDate} = req.query

            if (category) {
                const validCategories = [
                    'ROAD_ISSUE',
                    'GRAFFITI',
                    'ILLEGAL_DUMPING',
                    'STREET_LIGHT_ISSUE',
                    'OTHER'
                ]
                if (!validCategories.includes(category)) {
                    return res.status(400).json({
                        message: 'Categoría inválida'
                    })
                }
            }

            const result = await AnalyticsService.getTimeByStatus({
                category, startDate, endDate
            })

            return res.status(200).json({
                message: "Tiempo promedio por estado obtenido exitosamente",
                ...result
            })
        } catch (error) {
            console.error("Error in getTimePerStatus controller:", error)
            return res.status(500).json({
                message: 'Error al obtener tiempo promedio por estado'
            })
        }
    }
    
    static async getStatusTransitions(req, res) {
        try {
            const { startDate, endDate } = req.query

            const result = await AnalyticsService.getStatusTransitions({
                startDate,
                endDate
            })

            return res.status(200).json({
                message: 'Análisis de transiciones obtenido exitosamente',
                ...result
            })
        } catch (error) {
            console.error("Error in getStatusTransitions controller:", error)
            return res.status(500).json({
                message: 'Error al obtener análisis de transiciones'
            })
        }
    }
    
    static async generateFullReportPDF(req, res) {
        try {
            const { startDate, endDate } = req.query

            const pdfBuffer = await AnalyticsService.generateFullReportPDF({
                startDate,
                endDate
            })

            // Configurar headers para descarga
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename=reporte-analytics-${new Date().toISOString().split('T')[0]}.pdf`)
            
            return res.send(pdfBuffer)
        } catch (error) {
            console.error("Error in generateFullReportPDF controller:", error)
            return res.status(500).json({
                message: 'Error al generar el reporte PDF'
            })
        }
    }
}