import 'express-async-errors'
import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import passport from 'passport'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

import { Auth } from './services/auth.services.js'
import { userRouter } from './routers/user.router.js'
import { videoRouter } from './routers/video.router.js'
import { errorHandleMiddleware } from './middleware/error.middleware.js'

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 20, // 15 dakika içinde izin verilen maksimum istek sayısı
    message: "Too many requests from this IP, please try again after 15 minutes"
});


// middleware
app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
// passport middleware implemention
app.use(passport.initialize())
passport.use('jwt', Auth.strategy())

// api routes
app.use('/user', userRouter)
app.use('/video',/* passport.authenticate('jwt', { session: false }), */  limiter, videoRouter)

// error handler
app.use(errorHandleMiddleware)

export { app }