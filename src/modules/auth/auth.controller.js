import { tr } from "zod/v4/locales";
import { AuthService } from "./auth.service.js";

const {login, register, resetPassword, recoverPassword, verifyAccount} = AuthService

export class AuthController{
    static async login(req, res){
        try {
            const {password, email} = req.body

            const result = await login({email, password})

            return res.status(200).json({
                ok: true,
                user: result.user,
                token: result.token
            })
        } catch (error) {
            console.log(error.message)
            return res.status(400).json({ message: error.message })
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
            const {email} = req.body

            const result = await recoverPassword({email})

            res.status(200).json({
                ok: true,
                result
            })
        } catch (error) {
            console.log(error.message)
            return res.status(400).json({ message: error.message })
        }
    }

    static async resetPassword(req, res){
        try {
            const {password} = req.body
            const {token} = req.query

            const result = await resetPassword({token, password})

            res.status(200).json({
                ok: true,
                result
            })
        } catch (error) {
            console.log(error.message)
            return res.status(400).json({ message: error.message })
        }
    }

    static async verifyAccount(req, res){
        try {
            const {token} = req.query

            const result = await verifyAccount({token})

            return res.status(200).json({
                ok: true,
                result
            })
        } catch (error) {
            console.log(error.message)
            return res.status(400).json({ message: error.message })
        }
    }
}