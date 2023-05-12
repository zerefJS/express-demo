import 'dotenv/config'
import "express-async-errors"
import "core-js/stable/index.js"

import express from 'express'
import cors from 'cors'
import passport from 'passport'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { Strategy as JWTStrategy } from 'passport-jwt';
// import { Strategy as LocalStrategy } from 'passport-local';

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
app.use(express.json({ limit: "30kb" }))
app.use(cors())
app.use(morgan('dev'))

// passport middleware implemention
app.use(passport.initialize())
passport.use('jwt', Auth.useJwtStrategy(JWTStrategy))
// idk why i used the local strategy
// passport.use('local', Auth.useLocalStrategy())

// api routes
app.use('/user', userRouter)
// const newLocal = passport.authenticate('local', { session: false })
app.use('/video', limiter, videoRouter)

// error handler
app.use(errorHandleMiddleware)

export { app }