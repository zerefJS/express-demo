import { MulterError } from 'multer'
import { ApiError } from '../services/error.services.js'
import { multerError } from '../config/multer-error-message.js'
import JsonWebTokenError from 'jsonwebtoken/lib/JsonWebTokenError.js'

export const errorHandleMiddleware = (err, req, res, next) => {
   if (err instanceof ApiError) {
      return res.status(err.statusCode).send({
         success: false,
         message: err.message,
      })
   }
   if (err instanceof MulterError) {
      const message = multerError[err.code] || 'Unexpected error. Please try again'
      return res.status(500).send({
         success: false,
         message,
      })
   }

   if(err instanceof JsonWebTokenError) {
      return res.status(403).send({
         success: false,
         message: "Invalid Token!"
      })
   }

   console.log(err)
   return res.status(500).send({
      success: false,
      message: 'Unexpected error. Please try again',
   })
}
