// src/lib/db.js
import mysql, { Connection } from 'mysql2/promise';

// mysql://root:gYvwbsccsHHJDEzcPLMznQXbeYQDNvPW@junction.proxy.rlwy.net:55944/railway
const connectToDatabase = async (): Promise<Connection | null> => {
  try {
    const connection = await mysql.createConnection({
      host: '181.224.131.55',
      port: 3306,
      user: 'aiattorn_devOne',
      password: 'AiAttorney987612345',
      database: 'aiattorn_dev',
    });
  

    console.log("Database connected Successfully")
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return null;
  }
};

export default connectToDatabase;
