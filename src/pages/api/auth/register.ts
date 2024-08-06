import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, name, phone } = req.body;
  if (!email || !password || !name || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        isEmailVerified: false, 
        settings: {},
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('User created successfully:', user);
    res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error });
  }
}
