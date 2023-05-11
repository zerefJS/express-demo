import Joi from 'joi'
import { ApiError } from '../services/error.services.js'

const fieldSchema = Joi.string().trim().required().min(3).max(255)
const fieldSchemaOptional = Joi.string().trim().min(3).max(255).optional()

const schema = Joi.object({
    name: fieldSchema,
    url: fieldSchema,
    poster: fieldSchema,
    description: fieldSchemaOptional,
    category: fieldSchemaOptional,
})

export const videoValidation = async (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
        throw new ApiError(error.message, 401)
    }
    next()
}
