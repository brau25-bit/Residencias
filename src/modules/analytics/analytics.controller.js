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
            
        } catch (error) {
            
        }
    }

    static async getReportsOverTime(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async getReportHeatMap(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async getReportResolutionTime(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async getTimeByStatus(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async getReportStatusTransition(req, res){
        try {
            
        } catch (error) {
            
        }
    }
}