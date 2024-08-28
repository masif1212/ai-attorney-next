// src/lib/db.js
import mysql, { Connection } from 'mysql2/promise'

// mysql://root:gYvwbsccsHHJDEzcPLMznQXbeYQDNvPW@junction.proxy.rlwy.net:55944/railway
const connectToDatabase = async (): Promise<Connection | null> => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: 3306,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    })

    console.log('Database connected Successfully')
    return connection
  } catch (error) {
    console.error('Error connecting to the database:', error)
    return null
  }
}

export default connectToDatabase
