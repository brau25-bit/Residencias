import { AuthService } from "./auth.service.js";

const {login, register, recoverPassword, verifieAccount} = AuthService

export class AuthController{
    static async login(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async register(req, res){
        try {
            const result = await register(req.validated)
            return res.status(201).json(result)
        } catch (error) {
            console.log(error.message)
            return res.status(400).json({ message: error.message })
        }
    }

    static async recoverPassword(req, res){
        try {
            
        } catch (error) {
            
        }
    }

    static async verifieAccount(req, res){
        try {
            
        } catch (error) {
            
        }
    }
}