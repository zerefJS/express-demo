import express from 'express'
import multer from 'multer'
import asyncHandler from 'express-async-handler'
import { Auth } from '../services/auth.services.js'
import { ApiError } from '../services/error.services.js'
import { excludeFields } from '../utils/excludeFields.js'

const router = express.Router()
const avatarDirectory = './public/uploads/avatar'

const storage = multer.diskStorage({
   destination(req, file, cb) {
      cb(null, avatarDirectory)
   },

   filename(req, file, cb) {
      const { name } = req.body
      const ext = file.mimetype.split('/')[1]
      const fileName = `${name
         .trim()
         .replace(/ /, '-')
         .toLowerCase()}-avatar-${Date.now()}.${ext}`
      cb(null, fileName)
   },
})

const acceptedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']

const upload = multer({
   storage,
   limits: {
      fileSize: 3 * 1024 * 1024,
   },
   fileFilter(req, file, cb) {
      if (!acceptedMimeTypes.includes(file?.mimetype)) {
         return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file?.fieldname))
      }
      cb(null, true)
   },
})

router.post(
   '/register',
   upload.single('avatar'),
   asyncHandler(async (req, res) => {
      const avatar = req.file.filename
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
      const userAgent = req.headers['user-agent']

      // const userPayload = Object.assign(req.body, { ip, userAgent, avatar })
      const userPayload = { ...req.body, ip, userAgent, avatar }
      const isRegistered = await Auth.register(userPayload)

      if(!isRegistered) return res.status(401).send({
         success: false,
         message: "Register failed"
      })

      res.status(200).send({
         success: true,
         message: 'User successfuly created',
      })
   })
)

router.post(
   '/login',
   asyncHandler(async (req, res) => {

      const userAgent = req.headers['user-agent']
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

      if (!email || !password) {
         throw new ApiError('Email and password required', 400)
      }
      const user = await Auth.login(req.body)
      if (user?.ip !== ip || user?.user_agent !== userAgent)
         throw new ApiError('Login Failed', 401)

      const payload = {
         id: user.id,
         name: user.name,
         email: user.email,
         ip: user.ip,
         userAgent: user.user_agent,
      }

      const token = await Auth.generateToken(payload)
      if (!token) throw new ApiError('Login Failed', 500)

      res.cookie('token', token, {
         httpOnly: true,
         maxAge: Number(process.env.COOKIE_MAX_AGE),
      })

      res.status(200).json({
         success: true,
      })
   })
)

router.post('/logout', (req, res) => {
   const data = Auth.logout(req, res)
   if (!data) throw new ApiError('Logout Failed, Please try again.', 400)

   res.status(200).json({
      success: true,
      data,
   })
})

export { router as authRouter }
