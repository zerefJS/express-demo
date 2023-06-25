import Joi from 'joi'
import { ApiError } from '../services/error.services.js'

const videoSchema = Joi.string().trim().required().min(1).max(255)
const videoSchemaOptional = Joi.string().trim().min(1).max(255).optional()

const schema = Joi.object({
   name: videoSchema,
   url: videoSchema,
   poster: videoSchema,
   description: videoSchemaOptional,
   category: videoSchemaOptional,
})

export const videoValidation = (req, res, next) => {
   const { error } = schema.validate(req.body)
   if (error) throw new ApiError(error.message.replace(/"/g, ''), 401)
   next()
}
