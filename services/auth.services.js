import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './user.services.js';
import { ApiError } from './error.services.js';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { jwtOptions } from '../config/jwt.config.js';

export class Auth {
    constructor() {
        if (this.constructor === Auth) {
            throw new Error("Abstract Class cannot be created");
        }
    }

    static strategy() {
        return new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
            try {
                const user = await User.findById(jwtPayload.sub);
                if (!user) {
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        });
    }

    static #generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    }

    static async login({ email, password }) {
        const data = await User.findByEmailOrName({ email });
        if (!data) {
            throw new ApiError('User not found.', 401);
        }

        const isPasswordValid = await bcrypt.compare(password, data.password);
        if (!isPasswordValid) {
            throw new ApiError('Invalid password.', 401);
        }

        const { id, name } = data;

        const token = Auth.#generateToken({ sub: id, name });

        return { token, user: { id, name } };
    }
}



