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

    static async banUser({id, banReason}){
        try {
            if(!id) throw new Error("Id de usuario no es valido");
            
            const user = await prisma.user.findUnique({
                where: {id: id}
            })

            if(!user) throw new Error("Usuario no encontrado")

            if(user.isBanned) throw new Error("Usuario ya esta baneado")

            if(user.role === 'ADMIN') throw new Error('No puedes banear a otros administradores')
            
            const result = await prisma.user.update({
                where: {id: id},
                data: {
                    isBanned: true,
                    bannedAt: new Date(),
                    banReason: banReason || "sin razon definida",
                    canReport: false
                },
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    email: true,
                    isBanned: true,
                    banReason: true,
                    bannedAt: true
                }
            })

            return result
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async unbanUser({id}){
        try {
            if(!id) throw new Error("ID de usuario no proporcionado")
            
            const user = await prisma.user.findUnique({
                where: { id: id }
            })

            if(!user) throw new Error("Usuario no encontrado")
            if(!user.isBanned) throw new Error("El usuario no está baneado")

            const result = await prisma.user.update({
                where: { id: id },
                data: {
                    isBanned: false,
                    bannedAt: null,
                    banReason: null,
                    canReport: true
                },
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    email: true,
                    isBanned: true
                }
            })

            return result
        } catch (error) {
            console.error("Error unbanning user:", error)
            throw error
        }
    }

    static async toggleReportUser({id}){
        try {
            if(!id) throw new Error("Id no proporcionado")

            const user = await prisma.user.findUnique({
                where: {id: id}
            })

            if(!user) throw new Error("Usuario no encontrado")

            const canReport = user.canReport ? false : true

            const result = await prisma.user.update({
                where: {id: id},
                data: {
                    canReport: canReport
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    canReport: true
                }
            })

            return result            
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }

    static async changeUserRole({id, role}){
        try {
            if(!id || !role) throw new Error("Datos no proporcionados")

            const user = await prisma.user.findUnique({
                where: {id: id}
            })

            if(!user) throw new Error("Usuario no encontrado");
            if(user.role === role) throw new Error("Usuario no encontrado");
            
            const result = await prisma.user.update({
                where: {id: id},
                data: {
                    role: role
                },
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    email: true,
                    verified: true,
                    role: true
                }
            })

            return result
        } catch (error) {
            console.error("Error creating report:", error)
            throw error
        }
    }
}