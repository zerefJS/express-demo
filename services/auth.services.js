import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { promisify } from 'util'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

import { User } from './user.services.js'
import { ApiError } from './error.services.js'
// import { Strategy as LocalStrategy } from 'passport-local'

const jwtOptions = {
   jwtFromRequest: ExtractJwt.fromExtractors([
      (req) => req?.cookies?.['token'],
      ExtractJwt.fromAuthHeaderAsBearerToken(),
   ]),
   secretOrKey: process.env.JWT_SECRET_KEY,
   passReqToCallback: true,
}

/**
 * @abstract
 * @public
 */
export class Auth {
   constructor() {
      if (this.constructor === Auth) {
         throw new Error('Abstract Class cannot be created')
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
    * @description use passport jwt strategy for user
    * @returns JwtStrategy
    */
   static userJwtStrategy() {
      return new JwtStrategy(jwtOptions, async (req, jwtPayload, done) => {
         try {
            const [userInfo] = await User.findByEmail({ email: jwtPayload.email })
            const isValid =
               userInfo &&
               jwtPayload?.ip === req.ip &&
               jwtPayload?.userAgent === req.headers['user-agent']

            if (!isValid) {
               return done(null, false)
            }
            return done(null, data)
         } catch {
            return done(null, false)
         }
      })
   }

   static adminJwtStrategy() {
      return new JwtStrategy(jwtOptions, async (req, jwtPayload, done) => {
         try {
            const [user] = await User.findByEmail({ email: jwtPayload.email })
            const isValidUser =
               user?.role === 'admin' &&
               jwtPayload.ip === req.ip &&
               jwtPayload.userAgent === req.headers['user-agent']
            if (!isValidUser) {
               return done(null, false)
            }

            return done(null, user)
         } catch {
            return done(null, false)
         }
      })
   }

   /**
    * @param {object} payload - user data
    * @returns {Promise<string>} token
    * @description generate user token
    */
   static generateToken(payload) {
      return promisify(jwt.sign)(payload, process.env.JWT_SECRET_KEY, {
         expiresIn: process.env.JWT_EXPIRE_TIME,
      })
   }

   /**
    * @param {string} token - user access token
    * @returns {Promise<any>} user decoded data
    * @description verify user token
    */
   static verifyToken(token) {
      // add - invalid token response
      try {
         return promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)
      } catch {
         return null
      }
   }

   /**
    * @param {string} email - user email
    * @param {string} password - user password
    * @returns {Promise<any>} User data
    * @description login user
    */
   static async login({ email, password }) {
      try {
         const [user] = await User.findByEmail({ email })

         if (!user && !(await bcrypt.compare(password, user?.password)))
            throw new ApiError('Login failed, please try again.', 401)
         return user
      } catch (err) {
         throw err
      }
   }

   static async register(userRegisterInfo) {
      try {
         const [isExistUser] = await User.findByEmailAndName(userRegisterInfo)
         if (isExistUser) throw new ApiError('Username or email already exist', 401)

         const user = new User(userRegisterInfo)
         await user.save()
         return true
      } catch (err) {
         throw err
      }
   }

   static async logout(req, res) {
      try {
         const token = req?.cookies?.token
         if (!token || !(await Auth.verifyToken(token))) return null

         const isValidToken = await Auth.verifyToken(token)

         res.clearCookie('token')
         return true
      } catch  {
         return null
      }
   }
}
