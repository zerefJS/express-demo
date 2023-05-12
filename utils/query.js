import mysql from 'mysql2/promise'
import { databaseConfig } from '../config/db.config.js'
import { checkResult } from './checkResult.js'
import { ApiError } from '../services/error.services.js'

const pool = mysql.createPool(databaseConfig)

// basic query
const query = async (sql) => {
    const db = await pool.getConnection()
    try {
        const result = await db.query(sql)
        return result
    } catch (err) {
        throw new ApiError(err.message, 500)
    } finally {
        db.release()
    }
}

// insert , update etc.
const queryWithParams = async (sql, params) => {
    if(!params) return null

    const db = await pool.getConnection()
    try {
        const result = await db.prepare(sql)
        const execute = await result.execute(params)
        return checkResult(execute)
    } catch (error) {
        throw new ApiError(error.message, 500)
    } finally {
        db.release()
    }
}


export {
    query,
    queryWithParams
}
