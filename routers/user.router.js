import express from 'express';
import { User } from '../services/user.services.js';
import { Auth } from '../services/auth.services.js';
import passport from 'passport';

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
        const data = await User.create(req.body)
        res.status(201).json({
            success: true,
            data
        })
    })

router
    .route('/login')
    .post(
        passport.authenticate("local", { session: false }),
        async (req, res) => {
            const data = await Auth.login(req.body)
            res.status(200).json(data)


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
