import Joi from 'joi'

const validateMessage = {
    'any.required': "{{#label}} is requried",
    'string.max': "{{#label}} is too long",
    'string.empty': '{{#label}} is not empty',
    'string.min': "{{#label}} is too short"
}

const schema = Joi.object({
    name: Joi
        .string()
        .trim()
        .required()
        .min(3)
        .max(255)
        .messages(validateMessage),

    url: Joi
        .string()
        .trim()
        .required()
        .min(3)
        .max(255)
        .messages(validateMessage),

    poster: Joi
        .string()
        .trim()
        .required()
        .min(3)
        .max(255)
        .messages(validateMessage),
})

const videoValidation = async (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        })
    }
    next()
}

export {
    videoValidation
}