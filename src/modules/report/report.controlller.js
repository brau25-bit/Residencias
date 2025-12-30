import { ReportService } from "./report.service.js";

export class ReportController{
    static async createReports(req, res){
        try {
            const report = await ReportService.createReports( 
                req.validated, 
                req.user.id
            )

            return res.status(201).json({
                message: 'Reporte creado exitosamente',
                report
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    static async getReports(req, res){
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 10

            const {category, latitude, longitude, status} = req.query

            const result = await ReportService.getReports({page, limit, category, latitude, longitude, status})

            return res.status(200).json({
                message: 'Reportes obtenidos',
                result
            })
        } catch (error) {
            
        }
    }

    static async getReportsByID(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async getReportsHistory(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async updateReports(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async updateReportsStatus(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async deleteReports(req, res){
        try {
            
        } catch (error) {
            
        }
    }
}