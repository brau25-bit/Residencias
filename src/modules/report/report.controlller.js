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
            const userId = req.user.id
            const role = req.user.role

            const {category, latitude, longitude, status} = req.query

            const result = await ReportService.getReports({
                page, 
                limit, 
                category, 
                latitude, 
                longitude, 
                status, 
                userId,
                role
            })

            return res.status(200).json({
                message: 'Reportes obtenidos',
                result
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    static async getReportsByID(req, res){
        try {
            const {id} = req.params

            console.log(id)

            const result = await ReportService.getReportsByID({id})

            return res.status(200).json({
                message: 'Reportes obtenidos',
                result
            })            
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    static async getReportsHistory(req, res){
        try {
            const {id} = req.params 
            const result = await ReportService.getReportsHistory({id: id})

            return res.status(200).json({
                message: "Historial obtenido exitosamente",
                result
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    static async updateReports(req, res){
        try {
            const {id} = req.params
            const data = req.validated

            const result = await ReportService.updateReports({id, data})

            return res.status(200).json({
                message: "Reporte actualizado correctamente",
                result
            })
        } catch (error) {
            return res.status(304).json({ message: error.message })
        }
    }

    static async updateReportStatus(req, res){
        try {
            const {id} = req.params
            const {status} = req.validated

            console.log("id: " + id)
            console.log("status: " + status)

            const result = await ReportService.updateReportStatus({
                id, 
                status, 
                userId: req.user.id})

            return res.status(200).json({
                message: "Estatus actualizado correctamente",
                result
            })
        } catch (error) {
            res.status(400).json({message: "error:" + error})
        }
    }

    static async deleteReports(req, res){
        try {
            const {id} = req.params

            const result = await ReportService.deleteReports({id})

            return res.status(200).json({
                message: "Reporte eliminado",
                result
            })
        } catch (error) {
            res.status(404).json({message: error.message})
        }
    }
}