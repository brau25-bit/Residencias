import z from 'zod'

export const userSchema = z.object({
    email: z.string()
    .email("Formato de email invalido")
    .max(255, "Email demasiado largo"),
    
    password: z.string()
    .min(6, "La contraseña es muy corta")
    .max(255, "La contraseña es demasiado larga"),

    name: z.string()
    .min(3, "Nombre demasiado corto")
    .max(255, "Nombre demasiado largo"),

    lastname: z.string()
    .min(3, "Apellido demasiado corto")
    .max(255, "Apellido demasiado largo")
    .optional(),

    role: z.enum(["USER", "ADMIN", "TECHNICIAN"])
    .optional(),

    banReason: z.string()
    .min(3, "razon demasiado corta")
    .max(500, "razon demasiado larga")
    .optional()
})

export const partialUserSchema = userSchema.partial()