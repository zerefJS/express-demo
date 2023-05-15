import 'dotenv/config'
import "express-async-errors"
import "core-js/stable/index.js"

import express from 'express'
import cors from 'cors'
import passport from 'passport'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import xss from 'xss-clean'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import { Auth } from './services/auth.services.js'
import { userRouter } from './routers/user.router.js'
import { videoRouter } from './routers/video.router.js'
import { errorHandleMiddleware } from './middleware/error.middleware.js'

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 20, // 15 dakika içinde izin verilen maksimum istek sayısı
    message: "Too many requests from this IP, please try again after 15 minutes"
})

// middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(xss())
app.use(cookieParser())
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(morgan('dev'))

// passport middleware implemention
app.use(passport.initialize())
passport.use('jwt', Auth.useJwtStrategy())
// idk why i used the local strategy
// passport.use('local', Auth.useLocalStrategy())

// api routes
app.use('/user', limiter, userRouter)
// const newLocal = passport.authenticate('local', { session: false })
app.use('/video', limiter, passport.authenticate('jwt', { session: false, }), videoRouter)

// error handler
app.use(errorHandleMiddleware)

export { app }
