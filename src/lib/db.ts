// src/lib/db.js
import mysql, { Connection } from 'mysql2/promise';

// mysql://root:gYvwbsccsHHJDEzcPLMznQXbeYQDNvPW@junction.proxy.rlwy.net:55944/railway
const connectToDatabase = async (): Promise<Connection | null> => {
  try {
    const connection = await mysql.createConnection({
      host: 'junction.proxy.rlwy.net',
      port: 55944,
      user: 'root',
      password: 'gYvwbsccsHHJDEzcPLMznQXbeYQDNvPW',
      database: 'railway',
    });
  

    console.log("Database connected Successfully")
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return null;
  }
};

export default connectToDatabase;
