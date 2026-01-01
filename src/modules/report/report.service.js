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

    static async getReportsHistory({id}){
        try {
            if(!id) throw new Error('ID de reporte no proporcionado')

            const report = await prisma.report.findUnique({
                where: {id: id},
                select: {
                    id: true,
                    isDeleted: true
                }
            })

            if(!report) throw new Error('Reporte no existe')
            if(report.isDeleted) throw new Error('Reporte no existe')

            const reportHistory = await prisma.reportStatusHistory.findMany({
                where: {reportId: id},
                include: {
                    changedBy: {
                        select: {
                            id: true,
                            name: true,
                            lastname: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    changedAt: 'desc'
                }
            })

            return reportHistory
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async updateReports({id, data}){
        try {
            if(!id) throw new Error("Credenciales incorrectas")

            const exists = await prisma.report.findUnique({
                where: {id: id}
            })

            if(exists.length === 0) throw new Error("Datos incorrectos")

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

    static async updateReportStatus({id, status, userId}){
        try {
            if(!id || !status) throw new Error("Datos invalidos")

            const report = await prisma.report.findUnique({
                where: {id: id}
            })

            if(!report) throw new Error("No encontrado");

            const oldStatus = report.status
            const newStatus = status

            if(oldStatus === newStatus) {
                throw new Error("El reporte ya tiene ese estado")
            }

            const result = await prisma.$transaction(async (tx) => {
                const updatedReport = await tx.report.update({
                    where: { id: report.id },
                    data: { status: newStatus }
                })

                const history = await tx.reportStatusHistory.create({
                    data: {
                        reportId: report.id,
                        oldStatus: oldStatus,
                        newStatus: newStatus,
                        changedById: userId
                    }
            })

            return { updatedReport, history }
        })

            return result
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async deleteReports({id}){
        try {
            if(!id) throw new Error("Datos incorrectos")

            const data = {
                isVisible: false,
                isDeleted: true
            }
            
            const result = await prisma.report.update({
                where: {id: id},
                data: data
            })

            return result
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }
}