import bcrypt from 'bcryptjs'
import { executeQuery, query, queryWithParams } from '../utils/database.js'
import { ApiError } from './error.services.js'

export class User {
   #name
   #email
   #password
   #avatar
   #ip
   #userAgent

   constructor({ name, email, password, avatar, ip, userAgent }) {
      this.#name = name
      this.#email = email
      this.#password = password
      this.#avatar = avatar
      this.#ip = ip
      this.#userAgent = userAgent
   }

   async save() {
      try {
         await this.#hashPassword()
         const data = await executeQuery(
            `
         INSERT INTO users (name, email, password, ip, user_agent, avatar) 
         VALUES (?, ?, ?, ?, ?, ?)`,
            [this.#name, this.#email, this.#password, this.#ip, this.#userAgent, this.#avatar]
         )

         if (!data.affectedRows) throw new ApiError('Create user failed')
      } catch (err) {
         throw err
      }
   }

   async #hashPassword() {
      this.#password = await bcrypt.hash(this.#password, 10)
   }

   static async isAdmin({ email }) {
      try {
         const [isAdmin] = await queryWithParams(`SELECT * FROM users WHERE email = ? LIMIT 1`, [
            email,
         ])

         return isAdmin ? isAdmin.role === 'admin' : false
      } catch {
         return false
      }
   }

   // dev mode function
   static async findMany() {
      return await query(`SELECT * FROM users LIMIT 50`)
   }

   static async findByEmailAndName({ email, name }) {
      return await queryWithParams(`SELECT * FROM users WHERE email = ? AND name = ? LIMIT 1`, [
         email,
         name,
      ])
   }

   static async findByEmail({ email }) {
      return await queryWithParams(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email])
   }

   static async findByName({ name }) {
      return await queryWithParams(`SELECT * FROM users WHERE id = name LIMIT 1`, [name])
   }
}
