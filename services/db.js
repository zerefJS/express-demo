import mysql from 'mysql2/promise'
import { databaseConfig } from '../config/db.config.js'

const db = mysql.createPool(databaseConfig)
db.getConnection((err, connection) => {
    if (err) throw err;

    console.log('Number of connections: ', pool._allConnections.length);

    // release connection
    connection.release();
});

export { db }