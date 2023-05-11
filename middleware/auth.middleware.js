import { Auth } from "../services/auth.services"
import { ApiError } from "../services/error.services.js"

const authenticationUser = (req, res, next) => {
    const token = req?.headers?.authorization?.split?.(' ')?.[1]
    if(!token) throw new ApiError("Unauthorized", 401)
    const user = Auth.verifyUser(token)
    if(!user) throw new ApiError("Unauthorized", 401)
    req.user = user
    next()
}