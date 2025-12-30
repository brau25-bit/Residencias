import z from 'zod'

export const reportSchema = z.object({
    title: z.string()
        .min(3, "Título demasiado corto")
        .max(255, "Título demasiado largo"),

    description: z.string()
        .min(10, "Descripción demasiado corta")
        .max(1000, "Descripción demasiado larga"),

    category: z.enum([
        "OTHER", 
        "ROAD_ISSUE", 
        "GRAFFITI", 
        "ILLEGAL_DUMPING", 
        "STREET_LIGHT_ISSUE"
    ], {
        errorMap: () => ({ message: "Categoría inválida" })
    }),

    latitude: z.number()
        .min(-90, "Latitud debe estar entre -90 y 90")
        .max(90, "Latitud debe estar entre -90 y 90"),

    longitude: z.number()
        .min(-180, "Longitud debe estar entre -180 y 180")
        .max(180, "Longitud debe estar entre -180 y 180")
})

export const partialReportSchema = reportSchema.partial()