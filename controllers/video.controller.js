import asyncHandler from 'express-async-handler'
import { Video } from '../services/video.services.js'

const getVideoAll = async (req, res) => {
   // const [data] = await Video.findMany()
   // if (!data) {
   //    return res.status(404).send({
   //       success: false,
   //       message: 'Video not found',
   //    })
   // }

   let number = req.body.number

   if (Number.isNaN(number)) {
      number = 1
   } else {
      number = parseInt(number)
   }

   const video = await Video.paginate(number)
   if (video[0] === null)
      res.status(400).send({
         success: false,
         message: 'Videolar bitti',
      })

   res.status(200).send({
      success: true,
      data: video,
   })
}

const createVideo = asyncHandler(async (req, res) => {
   const video = new Video(req.body)
   const data = await video.save()

   res.status(201).send({
      success: true,
      message: 'Video created successfuly.',
      data,
   })
})

const getByVideoUrl = async (req, res) => {
   const [video] = await Video.findByUrl(req.params.url)
   if (!video) {
      return res.status(404).send({
         success: false,
         message: 'Video not found',
      })
   }
   return res.status(200).send({
      succes: true,
      data: {
         video,
      },
   })
}
const updateByVideoUrl = async (req, res) => {}
const deleteByVideoUrl = async (req, res) => {}

export default {
   getVideoAll,
   createVideo,
   getByVideoUrl,
   updateByVideoUrl,
   deleteByVideoUrl,
}
