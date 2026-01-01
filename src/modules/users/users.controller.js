import { UserService } from "./users.service.js";

export class UserController{
    static async getUsers(req, res){
        try {
            const {role, isActive, verified, isBanned, canReport, isDeleted} = req.query

            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 10

            const result = await UserService.getUsers({
                role, isActive, verified, isBanned, canReport, isDeleted, page, limit
            })

            return res.status(200).json({
                message: "Usuarios obtenidos satisfactoriamente",
                result
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    static async getUserById(req, res){
        try {
            const {id} = req.params

            const result = await UserService.getUsersById({id})

            return res.status(200).json({
                message: "Usuario obtenido satisfactoriamente",
                result
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    static async banUser(req, res){
        try {
            const {id} = req.params
            const { banReason } = req.validated

            console.log(banReason + " - " + req.validated.banReason)

            if(id === req.user.id) {
                return res.status(400).json({ 
                    message: 'No puedes banearte a ti mismo' 
                })
            }

            console.log(banReason)

            const result = await UserService.banUser({id, banReason})

            return res.status(200).json({
                message: "Cambio aplicado satisfactoriamente",
                result
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    static async unbanUser(req, res){
        try {
            const { id } = req.params

            const result = await UserService.unbanUser({id})

            return res.status(200).json({
                message: "Usuario desbaneado exitosamente",
                user: result
            })
        } catch (error) {
            console.error("Error in unbanUser controller:", error)
            
            if(error.message === 'Usuario no encontrado') {
                return res.status(404).json({ message: error.message })
            }
            
            if(error.message.includes('baneado')) {
                return res.status(400).json({ message: error.message })
            }
            
            return res.status(500).json({ 
                message: 'Error al desbanear usuario' 
            })
        }
    }

    static async toggleReportUser(req, res){
        try {
            const {id} = req.params

            const result = await UserService.toggleReportUser({id})

            return res.status(200).json({
                message: "Cambio aplicado satisfactoriamente",
                result
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    static async changeUserRole(req, res){
        try {
            const {id} = req.params
            const {role} = req.validated

            const result = await UserService.changeUserRole({id, role})

            return res.status(200).json({
                message: "Cambio aplicado satisfactoriamente",
                result
            })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }
}