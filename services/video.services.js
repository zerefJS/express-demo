import { db } from "./db.js";

export class Video {
    static async findByUrl({ url }) {
        console.time("findByUrl")
        const video = await db.getConnection()
        try {
            const result = await video.prepare(/*sql*/`SELECT * FROM video WHERE url = ?`)
            const [data] = await result.execute([url])

            if (data.length === 0) throw new Error("Video not found")

            return {
                error: false,
                data: data[0],
                errorMessage: null
            }

        } catch (error) {
            return {
                error: true,
                data: null,
                errorMessage: error.message
            }

        } finally {
            video.release()
            console.timeEnd("findByUrl")
        }
    }
    static async findMany() {
        const video = await db.getConnection()
        try {
            const [data] = await video.query(/*sql*/`SELECT * FROM video`)
            if (data.length === 0) throw new Error("Video not found")

            return {
                error: false,
                data,
                errorMessage: null
            }

        } catch (error) {
            return {
                error: true,
                data: null,
                errorMessage: error.message
            }
        } finally {
            video.release()
        }

    }
    static async create({ name, url, poster, description = null, categories = null }) {
        const video = await db.getConnection()
        try {
            // /*sql*/ => sql highlight
            const result = await video.prepare(/*sql*/`INSERT INTO video (name, url, poster, description, categories) VALUES (?, ?, ?, ?, ?)`)
            const [data] = await result.execute([name, url, poster, description, categories])

            const [currentVideo] = await db.query(/*sql*/`SELECT * FROM video WHERE id = ?`, [data.insertId])

            return {
                error: false,
                data: currentVideo[0],
                errorMessage: null
            }

        } catch (error) {
            return {
                error: true,
                data: null,
                errorMessage: error.message
            }
        } finally {
            video.release()
        }
    }
}
