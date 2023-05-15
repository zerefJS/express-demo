import express from 'express';
import { User } from '../services/user.services.js';
import { Auth } from '../services/auth.services.js';
import { ApiError } from '../services/error.services.js';

const router = express.Router();

router
    .route('/')
    .get(async (req, res) => {
        const data = await User.findMany()
        res.status(200).json({
            success: true,
            data
        })
    })
    .post(async (req, res) => {

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const userAgent = req.headers['user-agent']

        const userData = Object.assign(req.body, { ip, userAgent })
        const data = await User.create(userData)

        if (!data) return res.status(401).json({
            success: false,
            message: "Invalid data"
        })

        res.status(201).json({
            success: true,
            data
        })
    })

router
    .post("/login",
        async (req, res) => {
            try {
                const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
                const userAgent = req.headers['user-agent']

                const data = await Auth.login(req.body)
                if (!Object.keys(data).length) throw new ApiError("Login Failed", 500)
                const payload = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    ip,
                    userAgent
                }
                const token = Auth.generateToken(res, payload)
                if(!token) throw new ApiError("Login Failed", 500)
                console.log(token)
                res.status(200).json({
                    success: true,
                    data
                })

            } catch (error) {
                console.log(error)
                res.status(401).json({
                    success: false,
                    message: "Invalid data",
                })
            }
        })

router
    .route('/:id')
    .get(async (req, res) => {
        const { id } = req.params
        const data = await User.findById(Number(id))
        res.status(200).json({
            success: true,
            data
        })
    })

export {
    router as userRouter
}
