import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// import { Strategy as LocalStrategy } from 'passport-local';
import { User } from './user.services.js';
import { ApiError } from './error.services.js';
import { jwtOptions } from '../config/jwt.config.js';

export class Auth {
    constructor() {
        if (this.constructor === Auth) {
            throw new Error("Abstract Class cannot be created");
        }
    }

    // static useLocalStrategy() {
    //     return new LocalStrategy({
    //         usernameField: 'email',
    //         passwordField: 'password',
    //         session: false
    //     }, async function (email, password, done) {
    //         try {
    //             const user = await User.findByEmailOrName({ email })
    //             if (!user) return done(null, false, { message: 'Incorrect email or password' })

    //             const isPasswordValid = await bcrypt.compare(password, user.password)
    //             if (!isPasswordValid) return done(null, false, { message: 'Incorrect email or password' })

    //             return done(null, user)

    //         } catch (error) {
    //             return done(error, false)
    //         }
    //     }
    //     )
    // }


    static useJwtStrategy(jwtStrategy) {
        return new jwtStrategy(jwtOptions, async (jwtPayload, done) => {
            try {
                const user = await User.findById(jwtPayload.id);
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

        const token = Auth.#generateToken({ id, name, email });

        return { token, user: { id, name, email } };
    }
}



