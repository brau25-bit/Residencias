import {rateLimit} from 'express-rate-limits'

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
})


export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Demasiados intentos de login, intenta más tarde',
    standardHeaders: 'draft-8',
    legacyHeaders: false
});