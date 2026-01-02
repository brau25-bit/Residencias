import prisma from "../../db/client.js";

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

    static async getReportsByCategory({}){
        try {
            
        } catch (error) {
            
        }
    }

    static async getReportsOverTime({}){
        try {
            
        } catch (error) {
            
        }
    }

    static async getReportHeatMap({}){
        try {
            
        } catch (error) {
            
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