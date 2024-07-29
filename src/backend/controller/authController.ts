import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';
import connectToDatabase from '../../lib/db';

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
    const connection = await connectToDatabase();
  
    if (!connection) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
  
    const { email, password } = req.body;
  
    console.log(email , password);

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    const [existingUsers]: [RowDataPacket[], any] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
  
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 12);
  
    await connection.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
  
    res.status(201).json({ message: 'User registered successfully' });
  };
  
  export const login = async (req: NextApiRequest, res: NextApiResponse) => {
    const connection = await connectToDatabase();
  
    if (!connection) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
  
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    const [rows]: [RowDataPacket[], any] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
  
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  
    res.status(200).json({ message: 'Logged in successfully' });
  };