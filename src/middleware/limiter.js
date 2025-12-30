// limiter.js
import {rateLimit} from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: 'Demasiadas solicitudes, intenta más tarde',
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,  // Cambiado de 'max' a 'limit'
    message: 'Demasiados intentos de login, intenta más tarde',
    standardHeaders: 'draft-8',
    legacyHeaders: false
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,  // Más estricto para recuperación y verificación
    message: 'Demasiadas solicitudes, intenta más tarde',
    standardHeaders: 'draft-8',
    legacyHeaders: false
})