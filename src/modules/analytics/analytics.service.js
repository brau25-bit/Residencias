import prisma from "../../db/client.js";
import { getWeekNumber } from "../../util/date.js";

export class AnalyticsService{
    static async getReportsByStatus({startDate, endDate} = {}){
        try {
            const where = {
                isDeleted: false
            }

            if(startDate || endDate) {
                where.createdAt = {}
                if(startDate) where.createdAt.gte = new Date(startDate)
                if(endDate) where.createdAt.lte = new Date(endDate)
            }

            const reportByStatus = await prisma.report.groupBy({
                by: ['status'],
                where,
                _count: {
                    status: true
                }
            })

            const data = reportByStatus.reduce((acc, item) => {
                acc[item.status] = item._count.status
                return acc
            }, {})

            const allStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
            allStatuses.forEach(status => {
                if(!data[status]){
                    data[status] = 0
                }
            })

            const total = Object.values(data).reduce((sum, count) => sum + count, 0)

            return {
                data,
                total
            }
        } catch (error) {
            
        }
    }

    static async getReportsByCategory({startDate, endDate} = {}){
        try {
            const where = {
                isDeleted: false
            }

            if(startDate || endDate){
                where.createdAt = {}
                if(startDate) where.createdAt.gte = new Date(startDate)
                if(endDate) where.createdAt.lte = new Date(endDate)
            }

            const reportByCategory = await prisma.report.groupBy({
                by: ['category'],
                where,
                _count: {
                    category: true
                }
            })

            const data = reportByCategory.reduce((acc, item) => {
                acc[item.category] = item._count.category
                return acc
            }, {})

            const allCategories = ['ROAD_ISSUE', 'GRAFFITI', 'ILLEGAL_DUMPING', 'STREET_LIGHT_ISSUE', 'OTHER']

            allCategories.forEach(status => {
                if(!data[status]){
                    data[status] = 0
                }
            })

            const total = Object.values(data).reduce((sum, count) => sum + count, 0)

            return {
                data,
                total
            }
        } catch (error) {
            
        }
    }

    static async getReportsOverTime({period = 'day', startDate, endDate} = {}){
        try {
            const where = {
                isDeleted: false
            }

            if(startDate || endDate){
                where.createdAt = {}
                if(startDate) where.createdAt.gte = new Date(startDate)
                if(endDate) where.createdAt.lte = new Date(endDate)
            }

            const reports = await prisma.report.findMany({
                where,
                select: {
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })

            const groupedData = {}

            reports.forEach(report => {
                let key

                switch (period) {
                    case 'day':
                        // Formato: 2025-01-15
                        key = report.createdAt.toISOString().split('T')[0]
                        break

                    case 'week':
                        // Formato: 2025-W03 (año-semana)
                        const weekNumber = getWeekNumber(report.createdAt)
                        key = `${report.createdAt.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`
                        break

                    case 'month':
                        // Formato: 2025-01
                        key = `${report.createdAt.getFullYear()}-${String(report.createdAt.getMonth() + 1).padStart(2, '0')}`
                        break

                    default:
                        key = report.createdAt.toISOString().split('T')[0]
                }

                groupedData[key] = (groupedData[key] || 0) + 1
            })

            const data = Object.entries(groupedData)
            .map(([date, count]) => ({date, count}))
            .sort((a,b) => a.date.localeCompare(b.data))

            return {
                data,
                period,
                total: reports.length
            }
        } catch (error) {
            console.error("Error getting reports over time:", error)
            throw error
        }
    }

    static async getReportHeatMap({ status, category, startDate, endDate } = {}){
        try {
            const where = {
                isDeleted: false,
                isVisible: true
            }

            if(status) where.status = status
            if(category) where.category = category

            if(startDate || endDate){
                where.createdAt = {}
                if(startDate) where.createdAt.gte = new Date(startDate)
                if(endDate) where.createdAt.lte = new Date(endDate)
            }

            const reports = await prisma.report.findMany({
                where,
                select: {
                    latitude: true,
                    longitude: true
                }
            })

            const coordinatesMap = {}

            reports.forEach(report => {
                const lat = Math.round(report.latitude * 10000) / 10000
                const lng = Math.round(report.longitude * 10000) / 10000
                const key = `${lat},${lng}`

                if (!coordinatesMap[key]) {
                    coordinatesMap[key] = {
                        latitude: lat,
                        longitude: lng,
                        intensity: 0
                    }
                }
                coordinatesMap[key].intensity++
            })

            const data = Object.values(coordinatesMap)

            return {
                data,
                total: reports.length,
                filters: {
                    ...(status && { status }),
                    ...(category && { category }),
                    ...(startDate && { startDate }),
                    ...(endDate && { endDate })
                }
            }
        } catch (error) {
            console.error("Error getting heatmap data:", error)
            throw error
        }
    }

    static async getReportResolutionTime({}){
        try {
            
        } catch (error) {
            
        }
    }

    static async getTimeByStatus({}){
        try {
            
        } catch (error) {
            
        }
    }

    static async getReportStatusTransition({}){
        try {
            
        } catch (error) {
            
        }
    }
}