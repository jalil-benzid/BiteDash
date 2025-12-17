import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message : 'BAAAAAAAAAAAAAAAAAAAAAAAD NO'
})

export {limiter}