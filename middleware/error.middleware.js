import { ApiError } from "../services/error.services.js"

export const errorHandleMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).send({
            success: false,
            message: "> " + err.message
        })
    }

    console.log(err)
    return res.status(500).send({
        success: false,
        message: "Unexpected error. Please try again"
    })
}
