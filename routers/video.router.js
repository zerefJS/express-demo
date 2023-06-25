import express from 'express'
import videoController from '../controllers/video.controller.js'
import { videoValidation } from '../middleware/video.middleware.js'
import passport from 'passport'

const router = express.Router()

router
   .route('/')
   .get(videoController.getVideoAll)
   .post(videoValidation, videoController.createVideo)

router
   .route('/:url')
   .get(videoController.getByVideoUrl)
   .put(videoController.updateByVideoUrl)
   .delete(videoController.deleteByVideoUrl)

export { router as videoRouter }
