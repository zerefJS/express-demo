import mysql from 'mysql2/promise'
import { databaseConfig } from '../config/db.config.js'
import { isResultArray, isResultObject } from './checkResult.js'

const pool = mysql.createPool(databaseConfig)

/**
 * @param {string} sql - query text
 * @returns {object | null}
 */
const query = async (sql) => {
    const db = await pool.getConnection()
    try {
        const [result] = await db.query(sql)
        return isResultArray(result)
    } catch (err) {
        console.log(err)
        return null
    } finally {
        db.release()
    }
}

/**
 * @param {string} sql query text
 * @example  sql = 'SELECT * FROM users WHERE id = ?'
 * @param {string} params query parameters
 * @example params = [1]
 * @returns {object | null}
 * @description SELECT queries, Not INSERT, UPDATE, DELETE
 */
const queryWithParams = async (sql, params) => {

    if(!params) return null

    const db = await pool.getConnection()
    
    try {
        const result = await db.prepare(sql)
        const [data] = await result.execute(params)
        return isResultArray(data)

    } catch (error) {
        return null

    } finally {
        db.release()
    }
}

/**
 * 
 * @param {string} sql - query text
 * @example sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
 * @param {string} params - sql query parameters
 * @example params = ['John Doe', 'XXXXXXXXXXXX', '123456']
 * @returns {object | null}
 * @description INSERT, UPDATE, DELETE queries, Not SELECT
 */
const executeInsertQuery = async (sql, params) => {
    const db =  await pool.getConnection()
    try {
        const data = await db.prepare(sql)
        const [result] = await data.execute(params)
        console.log(result)
        return isResultObject(result)
    } catch (error) {
        return null
    } finally {
        db.release() 
    }
}

export {
    query,
    queryWithParams,
    executeInsertQuery
}