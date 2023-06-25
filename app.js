import 'dotenv/config'
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
import { authRouter } from './routers/auth.router.js'
import { errorHandleMiddleware } from './middleware/error.middleware.js'

const app = express()

// global middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(xss())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json({ limit: '30kb' }))
app.use(express.urlencoded({ extended: true, limit: '30kb' }))
app.use('/', express.static('./public/uploads'))

// passport middleware implemention
app.use(passport.initialize())
passport.use('user-jwt', Auth.userJwtStrategy())
passport.use('admin-jwt', Auth.adminJwtStrategy())
// idk why i used the local strategy
// passport.use('local', Auth.useLocalStrategy())

// api rate limiter
const limiter = rateLimit({
   windowMs: 60 * 60 * 1000, // 60 minutes
   max: 100,
   message: 'Too many requests from this IP, please try again after 15 minutes',
})

// api routes
app.use('/api', limiter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use(
   '/api/v1/video',
   // passport.authenticate('user-jwt', { session: false }),
   videoRouter
)

// error handler
app.use(errorHandleMiddleware)

export { app }