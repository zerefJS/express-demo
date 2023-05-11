import { ApiError } from "../services/error.services.js"

export const errorHandleMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).send({
            success: false,
            message: "> " + err.message
        })
    }
    return res.status(500).send({
        success: false,
        message: err.message
    })
}
