import mysql from 'mysql2/promise'
import { databaseConfig } from '../config/db.config.js'
import { isResultArray, isResultObject } from './checkResult.js'

const pool = mysql.createPool(databaseConfig)

// Todo: Add db error logger ( winston )
/**
 * @param {string} sql - query text
 * @description basic query function, not prepared
 */
const query = async (sql) => {
   const db = await pool.getConnection()
   try {
      const [result] = await db.query(sql)
      return isResultArray(result)
   } catch {
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
 * @description SELECT queries, Not INSERT, UPDATE, DELETE
 */
const queryWithParams = async (sql, params) => {
   if (!params) return null
   const db = await pool.getConnection()

   try {
      const result = await db.prepare(sql)
      const [data] = await result.execute(params)
      console.log("🚀 ~ file: database.js:38 ~ queryWithParams ~ data:", data)
      return isResultArray(data)
   } catch {
      return [null]
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
 * @description INSERT, UPDATE, DELETE queries, Not SELECT
 */
const executeQuery = async (sql, params) => {
   if (!params) return null
   const db = await pool.getConnection()
   try {
      const data = await db.prepare(sql)
      const [result] = await data.execute(params)
      return isResultObject(result)
   } catch {
      return [null]
   } finally {
      db.release()
   }
}

export { query, queryWithParams, executeQuery }
