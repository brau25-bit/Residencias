import prisma from "../../db/client.js";

export class ReportService{
    static async createReports( data, userId ){
        try {
            const report = await prisma.report.create({
                data: {
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    userId: userId 
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            lastname: true,
                            email: true
                        }
                    }
                }
            })

            return report
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async getReports({page, limit, category, latitude, longitude, status}){
        try {
            const filters = {}

            if(category) filters.category = category
            if(status) filters.status = status

            if (latitude && longitude) {
                const lat = Number(latitude)
                const lng = Number(longitude)
                const radius = 0.01 // ≈1km

                filters.latitude = {
                    gte: lat - radius,
                    lte: lat + radius
                }

                filters.longitude = {
                    gte: lng - radius,
                    lte: lng + radius
                }
            }

            const reports = await prisma.reports.findMany({
                where: filters,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' }
            })

            if(reports.length === 0) throw new Error("Sin resultados")

            return {
                data: reports,
                page: page,
                limit: limit
            }
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async getReportsByID(){
        try {
            
        } catch (error) {
            
        }
    }

    static async getReportsHistory(){
        try {
            
        } catch (error) {
            
        }
    }

    static async updateReports(){
        try {
            
        } catch (error) {
            
        }
    }

    static async updateReportsStatus(){
        try {
            
        } catch (error) {
            
        }
    }

    static async deleteReports(){
        try {
            
        } catch (error) {
            
        }
    }
}