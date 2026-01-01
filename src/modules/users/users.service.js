import res from "express/lib/response.js";
import prisma from "../../db/client.js";

export class UserService{
    static async getUsers({
        role, isActive, verified, isBanned, canReport, isDeleted, page, limit
    }){
        try {
            const filter = {}

            if (isActive !== undefined)
            filter.isActive = isActive === 'true'

            if (verified !== undefined)
            filter.verified = verified === 'true'

            if (isBanned !== undefined)
            filter.isBanned = isBanned === 'true'

            if (canReport !== undefined)
            filter.canReport = canReport === 'true'

            if (isDeleted !== undefined)
            filter.isDeleted = isDeleted === 'true'


            const total = await prisma.user.count({
                where: filter
            })

            const result = await prisma.user.findMany({
                where: filter,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    email: true,
                    isActive: true, 
                    verified: true, 
                    isBanned: true, 
                    canReport: true, 
                    isDeleted: true
                }
            })

            if(result.length === 0) throw new Error('Fallo al encontrar usuarios')

            return {
                data: result,
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

    static async getUsersById({id}){
        try {
            const user = await prisma.user.findUnique({
                where: {id: id},
                select: {
                    id: true,
                    email: true,
                    name: true,
                    lastname: true,
                    isActive: true,
                    verified: true, 
                    verifiedAt: true,
                    isBanned: true,
                    bannedAt: true,
                    banReason: true,
                    canReport: true, 
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true
                }
            })

            if(!user) throw new Error('Usuario no encontrado')

            return user
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async banUser({id}){
        try {
            
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async toggleReportUser({id}){
        try {
            
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async changeUserRole({id, role}){
        try {
            
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }
}