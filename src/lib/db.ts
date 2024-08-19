// src/lib/db.js
import mysql, { Connection } from 'mysql2/promise';

const connectToDatabase = async (): Promise<Connection | null> => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root123',
      database: 'ai-attorney-next',
    });

    console.log("Database connected Successfully")
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return null;
  }
};

export default connectToDatabase;
