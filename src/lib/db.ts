// src/lib/db.js
import mysql, { Connection } from 'mysql2/promise';

// mysql://root:gYvwbsccsHHJDEzcPLMznQXbeYQDNvPW@junction.proxy.rlwy.net:55944/railway
const connectToDatabase = async (): Promise<Connection | null> => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root123',
      database: 'aiattorney',
    });
  

    console.log("Database connected Successfully")
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return null;
  }
};

export default connectToDatabase;
