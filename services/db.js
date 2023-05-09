import mysql from 'mysql2/promise'
import { databaseConfig } from '../config/db.config.js'

const db = mysql.createPool(databaseConfig)

export { db }