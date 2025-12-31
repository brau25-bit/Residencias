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

    static async getReports({
        page, limit, category, latitude, longitude, status, userId, role
    }){
        try {
            const filters = {}

            if(role === 'USER') filters.userId = userId

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

            filters.isDeleted = false
            filters.isVisible = true

            const total = await prisma.report.count({
                where: filters
            })

            const reports = await prisma.report.findMany({
                where: filters,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
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

            if(reports.length === 0) throw new Error("Sin resultados")

            return {
                data: reports,
                pagination: {
                    page: page,
                    limit: limit,
                    total: total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async getReportsByID({id}){
        try {
            if(!id) throw new Error("Id de reporte no proporcionado")

            const report = await prisma.report.findUnique({
                where: {id: id},
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            lastname: true,
                        }
                    }
                }
            })

            if(!report) throw new Error("No fue encontrado")

            if(report.isDeleted || !report.isVisible) throw new Error("No fue encontrado")

            return report
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async getReportsHistory(){
        try {
            
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async updateReports({id, data}){
        try {
            if(!id) throw new Error("Credenciales incorrectas")

            const report = await prisma.report.update({
                where: {id: id},
                data: data
            })

            return report
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async updateReportsStatus(){
        try {
            
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async deleteReports(){
        try {
            
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }
}