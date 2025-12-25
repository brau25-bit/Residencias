import hashService from '../../util/hash.js'
import jwtService from '../../util/jwt.js'
import prisma from '../../db/client.js'
import {emailService, passwordService} from '../../util/email.js'
import crypto from 'crypto'

export class AuthService{
    static async login({email, password}){
        const user = await prisma.user.findUnique({where: {email: email}})

        if(!user) throw new Error("Credenciales incorrectas: email")

        if(!user.verified) throw new Error("Debes de verificar la cuenta antes de iniciar sesion. Revisa tu email.")

        const result = await hashService.compare(password, user.password)

        if(!result) throw new Error("Credenciales incorrectas: password")

        const token = jwtService.sign({
            id: user.id,
            role: user.role
        })

        return{
            token,
            user: {
                email: user.email,
                name: user.name,
                lastname: user.lastname
            }
        }
    }

    static async register(data){
        try {
            const exists = await prisma.user.findUnique({
                where: { email: data.email }
            })

            if(exists) throw new Error("Credenciales incorrectas")

            const password = await hashService.hash(data.password)
            const verificationToken = crypto.randomBytes(32).toString('hex')

            const newuser = {
                ...data,
                password,
                verificationToken
            }

            const result = await prisma.user.create({data: newuser})

            if(!result) throw new Error("Fallo al registrar usuario");
            
            const verificationEmail = await emailService(newuser.email, verificationToken)

            return { message: "Usuario registrado correctamente" }
        } catch (error) {
            console.error("Error in register service:", error);
            throw error; 
        }

    }

    static async recoverPassword({email}){
        try {
            const user = await prisma.user.findUnique({
                where: {email: email}
            })

            if(!user) throw new Error('Credenciales invalidas')

            const token = crypto.randomBytes(32).toString('hex')

            const expiresIn = new Date()
            expiresIn.setHours(expiresIn.getHours() + 1)

            await prisma.user.update({
                where: {id: user.id},
                data: {
                    resetToken: token,
                    resetPasswordExpires: expiresIn
                }
            })

            await passwordService(email, token)

            return {message: "Un enlace ha sido enviado a tu email, desde el podras restaurar tu contraseña"}
        } catch (error) {
            console.error("Error in register service:", error);
            throw error; 
        }
    }

    static async resetPassword({token, password}){
        try {
            const user = await prisma.user.findUnique({
                where: {resetToken: token}
            })

            if(!user) throw new Error("Credenciales invalidas")

            const now = new Date()
            if(user.resetPasswordExpires < now) {
                throw new Error("El token ha expirado. Solicita un nuevo enlace de recuperación")
            }

            const newPassword = await hashService.hash(password)

            await prisma.user.update({
                where: {id: user.id},
                data: {
                    password: newPassword,
                    resetToken: null,
                    resetPasswordExpires: null
                }
            })

            return {message: "Contraseña reestablecida correctamente"}
        } catch (error) {
            console.error("Error in register service:", error);
            throw error; 
        }
    }

    static async verifyAccount({token}){
        try {
            const user = await prisma.user.findUnique(
                {where: {verificationToken: token}
            })

            if(!user) throw new Error("Credenciales invalidas")

            const verifiedAccount = await prisma.user.update({
                where: {id: user.id},
                data: {
                    verified: true,
                    verificationToken: null
                }
            })

            return {message: "Cuenta verificada exitosamente. Ya puedes iniciar sesión"}
        } catch (error) {
            console.error("Error in register service:", error);
            throw error; 
        }
    }
}