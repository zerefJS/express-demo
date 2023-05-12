
import bcrypt from "bcryptjs"
import { query, queryWithParams } from "../utils/query.js"
import { ApiError } from "./error.services.js"
import { checkResult } from "../utils/checkResult.js"

export class User {
    // dev mode function
    static async findMany() {
        const result = await query(
            /*sql*/`SELECT * FROM users ORDER BY users.name ASC LIMIT 100
        `)
        return result
    }

    static async create({ name, email, password }) {
        const isExistUser = await User.findByEmailOrName({ email, name })
        if (isExistUser) throw new ApiError('Username or email already exist', 401)

        const hashPassword = await bcrypt.hash(password, 10);
        const result = await queryWithParams(
            /*sql*/`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`
            ,
            [name, email, hashPassword])
        return result
    }

    static async findByEmailOrName({ email, name }) {
        const [data] = await queryWithParams(
            /*sql*/`SELECT * FROM users WHERE email = ? OR name = ? LIMIT 1`
            ,
            [email, name])

        return checkResult(data)
    }

    static async findById(id) {
        const userId = parseInt(id)
        if (typeof userId === 'number') return null

        const result = await queryWithParams(
            /*sql*/`SELECT * FROM users WHERE id = ? LIMIT 1`
            ,
            [id]
        )
        return result
    }
}
