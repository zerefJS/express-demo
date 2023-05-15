import jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { User } from './user.services.js';
import { ApiError } from './error.services.js';

// import { Strategy as LocalStrategy } from 'passport-local';


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
        (req) => req?.cookies?.['token']
    ]),
    secretOrKey: process.env.JWT_SECRET_KEY,
    passReqToCallback: true,
};

/**
 * @abstract this class is abstract and cannot be instanciated
 * @constructor
 * @public
 */
export class Auth {

    constructor() {
        if (this.constructor === Auth) {
            throw new Error("Abstract Class cannot be created");
        }
    }


    // TODO: this staretegy is not stable, fix it
    // static useLocalStrategy() {
    //     return new LocalStrategy({
    //         usernameField: 'email',
    //         passwordField: 'password',
    //     }, async function (email, password, done) {
    //         try {
    //             const user = await User.findByEmail({ email })
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
    /**
     * @description use passport jwt strategy
     * @returns passport jwt strategy
     */

    static useJwtStrategy() {
        return new JwtStrategy(jwtOptions, async (req, jwtPayload, done) => {
            try {
                console.log("jwtPayload ", jwtPayload)
                const [user] = await User.findByEmail({ email: jwtPayload.email });

                if (!Object.keys(user).length) {
                    return done(null, false);
                }

                const isValid = jwtPayload.ip === req.ip && jwtPayload.userAgent === req.headers['user-agent'];
                if (!isValid) {
                    console.log("user is invalid")
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        });
    }

    /**
    * @param {object} res - response object
    * @param {object} payload - user data
    * @returns {string} token 
    * @description generate user token and save in cookie
    */
    static generateToken(res, payload) {
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '5h' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 5
        });

        return token
    }


    /**
    * @param {string} email - user email
    * @param {string} password - user password
    * @returns {User} User data
    * @description login user
    */
    static async login({ email, password }) {
        const [data] = await User.findByEmail({ email });
        if (!Object.keys(data).length) throw new ApiError("is result not object", 401);

        const isPasswordValid = await bcrypt.compare(password, data.password);
        if (!isPasswordValid) {
            throw new ApiError('Invalid password.', 401);
        }

        return data;
    }
}



