
export function validateSchema(schema){
    return (req,res,next) => {
        const result = schema.safeparse(req.body)

        if(!result.success) return res.status(400).json( {error: result.error.flatten()} )

        req.validated = result

        next()        
    }
}