import express from 'express'
import asyncHandler from 'express-async-handler'
import passport from 'passport'
import { User } from '../services/user.services.js'
import { ApiError } from '../services/error.services.js'

const router = express.Router()

router.get('/', async (req, res) => {
   const data = await User.findMany()
   res.status(200).json({
      success: true,
      data,
   })
})

router.get(
   '/me',
   passport.authenticate('user-jwt', { session: false }),
   asyncHandler(async (req, res) => {
      const user = req?.userDetails || null
      if (!user) throw new ApiError('User not found', 404)

      res.status(200).json({
         success: true,
         data: user,
      })
   })
)

router.route('/:name').get(async (req, res) => {
   const data = await User.findByName(req.params)
   if (!data) {
      return res.status(404).send({
         success: false,
         message: 'User not found!',
      })
   }
   res.status(200).json({
      success: !0,
      data,
   })
})

export { router as userRouter }
