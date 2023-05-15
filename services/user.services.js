
import bcrypt from "bcryptjs"
import { executeInsertQuery, query, queryWithParams } from "../utils/query.js"
import { ApiError } from "./error.services.js"

export class User {
    // dev mode function
    static async findMany() {
        return await query(
            /*sql*/`SELECT * FROM users LIMIT 50
        `)
    }

    static async create({ name, email, password, avatar, ip, userAgent }) {

        const isExistUser = await User.findByEmailAndName({ email, name })
        if (isExistUser?.length) throw new ApiError('Username or email already exist', 401)

        const hashPassword = await bcrypt.hash(password, 10);

        const data = await executeInsertQuery(
            /*sql*/`INSERT INTO users (name, email, password, ip, user_agent, avatar) VALUES (?, ?, ?, ?, ?, ?)`
            ,
            [name, email, hashPassword, ip, userAgent, avatar]
        )

        if(!data) throw new ApiError("Create user failed", 500)

        return await queryWithParams(
            /*sql*/`SELECT * FROM users WHERE id = ? LIMIT 1`
            ,
            [data.insertId]
        )
    }

    static async findByEmailAndName({ email, name }) {
        return await queryWithParams(
            /*sql*/`SELECT * FROM users WHERE email = ? AND name = ? LIMIT 1`
            ,
            [email, name]
        )

    }

    static async findByEmail({ email }) {
        return await queryWithParams(
            /*sql*/`SELECT * FROM users WHERE email = ? LIMIT 1`
            ,
            [email]
        )
    }


    static async findById(id) {
        const userId = parseInt(id)
        if (typeof userId !== 'number') return null

        return await queryWithParams(
            /*sql*/`SELECT * FROM users WHERE id = ? LIMIT 1`
            ,
            [id]
        )
    }
}
