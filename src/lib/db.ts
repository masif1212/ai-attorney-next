import mysql, { Connection } from 'mysql2/promise'

// mysql://root:gYvwbsccsHHJDEzcPLMznQXbeYQDNvPW@junction.proxy.rlwy.net:55944/railway
"mysql://root:vsxcsdTBEavnekMELTZBTsYpIQsPlvJW@autorack.proxy.rlwy.net:50132/railway"
const connectToDatabase = async (): Promise<Connection | null> => {
  try {
    const connection = await mysql.createConnection({
      host: 'autorack.proxy.rlwy.net',
      port: 50132,
      user: 'root',
      password: 'vsxcsdTBEavnekMELTZBTsYpIQsPlvJW',
      database: 'railway',
    });
  

    console.log('Database connected Successfully')
    return connection
  } catch (error) {
    console.error('Error connecting to the database:', error)
    return null
  }
}

export default connectToDatabase
