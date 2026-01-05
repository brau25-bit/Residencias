import prisma from "../../db/client.js";
import { getWeekNumber } from "../../util/date.js";
import { calculateTransitionInsights } from "../../util/calculateTransition.js";

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

    static async getReportResolutionTime({startDate, endDate} = {}){
        try {
            const where = {
                status: 'COMPLETED',
                isDeleted: false
            }

            if(startDate || endDate){
                where.createdAt = {}
                if(startDate) where.createdAt.gte = new Date(startDate)
                if(endDate) where.createdAt.gte = new Date(endDate)
            }

            const completedReports = await prisma.report.findMany({
                where,
                select: {
                    id: true,
                    category: true,
                    createdAt: true,
                    history: {
                        where: {
                            newStatus: 'COMPLETED'
                        },
                        orderBy: {
                            changedAt: 'asc'
                        },
                        take: 1
                    }
                }
            })


            const byCategory = {}

            completedReports.forEach(report => {
                if(report.history.length === 0) return

                const category = report.category
                const createdAt = new Date(report.createdAt)
                const completedAt = new Date(report.history[0].changedAt)
                const timeInHours = (completedAt - createdAt) / (1000 * 60 * 60)

                if(!byCategory[category]){
                    byCategory[category] = {
                        totalTime: 0,
                        count: 0
                    }
                }

                byCategory[category].totalTime += timeInHours
                byCategory[category].count++
            })

            const data = {}

            Object.keys(byCategory).forEach(category => {
                const avg = byCategory[category].totalTime / byCategory[category].count

                data[category] = {
                    averageTimeInHours: Math.round(avg * 100) / 100,
                    averageTimeInDays: Math.round((avg / 24) * 100) / 100,
                    totalReports: byCategory[category].count
                }
            })

            return {data}
        } catch (error) {
            console.error("Error getting average resolution time by category:", error)
            throw error
        }
    }

    static async getTimeByStatus({category, startDate, endDate} = {}){
        try {
            const where = {}

            if(category) where.category = category

            if(startDate || endDate){
                where.createdAt = {}
                if(startDate) where.createdAt.gte = new Date(startDate)
                if(endDate) where.createdAt.lte = new Date(endDate)    
            }

            const reports = await prisma.report.findMany({
                where,
                select: {
                    id: true,
                    createdAt: true,
                    history: {
                        orderBy: {
                            changedAt: 'asc'
                        }
                    }
                }
            })

            const stateData = {
                'PENDING': { totalTime: 0, count: 0 },
                'IN_PROGRESS': { totalTime: 0, count: 0 },
                'COMPLETED': { totalTime: 0, count: 0 },
                'CANCELLED': { totalTime: 0, count: 0 }
            }

            reports.forEach(report => {
                const history = report.history

                if(history.length === 0) {
                    const now = new Date()
                    const timeInMs = now - new Date(report.createdAt)
                    const timeInHours = timeInMs / (1000 * 60 * 60)
                    
                    stateData['PENDING'].totalTime += timeInHours
                    stateData['PENDING'].count++
                    return
                }

                const firstChange = history[0]
                const timePending = (new Date(firstChange.changedAt) - new Date(report.createdAt)) / (1000 * 60 * 60)

                stateData['PENDING'].totalTime += timePending
                stateData['PENDING'].count++

                for(let i = 0; i < history.length - 1; i++){
                    const currentChange = history[i]
                    const nextChange = history[i + 1]

                    const state = currentChange.newStatus
                    const timeInState = (new Date(nextChange.changedAt) - new Date(currentChange.changedAt)) / (1000 * 60 * 60)

                    stateData[state].totalTime += timeInState
                    stateData[state].count++
                }

                const lastState = history[history.length - 1].newStatus
                stateData[lastState].count++  
            })

            const data = {}

            Object.keys(stateData).forEach(state => {
                const {totalTime, count} = stateData[state]

                if(count === 0){
                    data[state] = {
                        averageTimeInHours: 0,
                        averageTimeInDays: 0,
                        totalReports: 0
                    }
                } else {
                    const avgHours = totalTime / count
                    data[state] = {
                        averageTimeInHours: Math.round(avgHours * 100) / 100,
                        averageTimeInDays: Math.round((avgHours / 24) * 100) / 100,
                        totalReports: count
                    }

                    if(state === 'COMPLETED' || state === 'CANCELLED'){
                        data[state].note = "Estado final, no hay transición"
                    }
                }
            })
            
            return data
        } catch (error) {
            console.error("Error getting time per status:", error)
            throw error
        }
    }

    static async getStatusTransitions({ startDate, endDate } = {}) {
        try {
            const where = {}

            if (startDate || endDate) {
                where.changedAt = {}
                if (startDate) where.changedAt.gte = new Date(startDate)
                if (endDate) where.changedAt.lte = new Date(endDate)
            }

            const history = await prisma.reportStatusHistory.findMany({
                where,
                orderBy: {
                    changedAt: 'asc'
                },
                select: {
                    reportId: true,
                    oldStatus: true,
                    newStatus: true,
                    changedAt: true
                }
            })

            const transitions = {}
            
            history.forEach(change => {
                const key = `${change.oldStatus} -> ${change.newStatus}`
                transitions[key] = (transitions[key] || 0) + 1
            })

            const totalTransitions = Object.values(transitions).reduce((sum, count) => sum + count, 0)

            const insights = calculateTransitionInsights(transitions, history)

            return {
                data: {
                    transitions,
                    totalTransitions,
                    insights
                }
            }
        } catch (error) {
            console.error("Error getting status transitions:", error)
            throw error
        }
    }

    static async generateFullReportPDF({ startDate, endDate } = {}) {
        try {            
            // Obtener todos los datos necesarios
            const reportsByStatus = await this.getReportsByStatus({ startDate, endDate })

            const reportsByCategory = await this.getReportsByCategory({ startDate, endDate })

            const reportsOverTime = await this.getReportsOverTime({ period: 'week', startDate, endDate })

            const averageResolutionTime = await this.getReportResolutionTime({ startDate, endDate })

            const timePerStatus = await this.getTimeByStatus({ startDate, endDate })

            const statusTransitions = await this.getStatusTransitions({ startDate, endDate })

            // Compilar todos los datos
            const analyticsData = {
                reportsByStatus,
                reportsByCategory,
                reportsOverTime,
                averageResolutionTime,
                timePerStatus,
                statusTransitions
            }

            // Generar PDF
            const { PDFGenerator } = await import('./pdf/pdfGenerator.js')
            const pdfBuffer = await PDFGenerator.generateFullReport(analyticsData)

            return pdfBuffer
        } catch (error) {
            console.error("Error generating full report PDF:", error)
            throw error
        }
    }
}