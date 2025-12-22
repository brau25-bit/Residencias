import hashService from '../../utils/hash.js'
import jwtService from '../../utils/jwt.js'

export class AuthService{
    static async login(){

    }

    static async register(data){
        try {
            const exists = await prisma.findUnique({
                where:{
                    email: data.email
                }
            })

            if(exists) throw new Error("Invalid data, already exists")

            const password = await hashService.hash(data.password)

            const newuser = {
                ...data,
                password
            }

            const result = await prisma.create({data: newuser})

            if(!result) throw new Error("Failed to create user");
            

            return {
                id: result.id,
                email: result.email,
                name: result.name
            }
        } catch (error) {
            console.error("Error in register service:", error);
            throw error; 
        }

    }

    static async recoverPassword(){
        
    }

    static async verifieAccount(){
        
    }
}