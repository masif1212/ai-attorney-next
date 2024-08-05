import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret';

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using a fallback secret. This is not recommended for production.');
}

export const register = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password, name, phone, linkedinUrl, facebookUrl } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
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
      },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error });
  }
};

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error });
  }
};
