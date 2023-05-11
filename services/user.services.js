import { db } from "./db.js";
import bcrypt from "bcryptjs"
import { ApiError } from "./error.services.js";

export class User {
    // dev mode function
    static async findMany() {
        const user = await db.getConnection()
        const result = await user.query(/*sql*/`SELECT * FROM users ORDER BY users.name ASC LIMIT 10`)
        user.close()
        return result[0]
    }

    static async create({ name, email, password }) {
        const user = await db.getConnection()
        const data = await User.findByEmailOrName({ email, name })
        if (data) throw new ApiError('Username or email already in use.', 401, user)

        const hashPassword = await bcrypt.hash(password, 10);
        const result = await user.prepare(/*sql*/`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`)
        const [userValue] = await result.execute([name, email, hashPassword])
        const [userData] = await user.query(/*sql*/`SELECT * FROM users WHERE id = ?`, [userValue.insertId])


        user.release()
        return userData[0]
    }

    static async findByEmailOrName({ email, name = null }) {
        const user = await db.getConnection()
        const result = await user.prepare(/*sql*/`SELECT * FROM users WHERE email = ? OR name = ? LIMIT 1`)
        const [data] = await result.execute([email, name])

        user.release()
        if (data.length === 0) throw new ApiError("User not found.", 404)
        return data[0]
    }

    static async findById(id) {
        const userId = parseInt(id)
        if (typeof userId === 'number') throw new ApiError("Invalid id.", 400)

        const user = await db.getConnection()
        const [data] = await user.query(/*sql*/`SELECT * FROM users WHERE id = ? LIMIT 1`, [id])
        user.release()

        if (data.length === 0) throw new ApiError("User not found.", 404)
        return data[0]
    }
}
