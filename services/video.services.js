import { queryWithParams, query } from "../utils/query.js";

export class Video {
    static async findByUrl({ url }) {
        return await queryWithParams(/*sql*/`SELECT * FROM video WHERE url = ?`, [url])
    }

    static async findMany() {
        return await query(/*sql*/`SELECT * FROM video`)
    }

    static async create({ name, url, poster, description = null, categories = null }) {
        return await queryWithParams(
            /*sql*/`INSERT INTO video (name, url, poster, description, categories) 
            VALUES (?, ?, ?, ?, ?)`
            ,
            [name, url, poster, description, categories]
        )
    }
}
