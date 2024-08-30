import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_fallback_secret';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, deviceInfo } = req.body;

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

    // Check for any active sessions
    const activeSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        expiresAt: {
          gt: new Date(), // Active sessions only
        },
      },
    });

    if (activeSession) {
      // If an active session exists, return an error message
      return res.status(400).json({ message: 'User is already logged in from another device.' });
    }

    // Create a new chat if none exists
    let chat = await prisma.chat.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId: user.id,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Calculate the expiration time of the token
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Create a new session in the database
    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        deviceInfo: deviceInfo,
        expiresAt: expiresAt,
      },
    });

    res.status(200).json({ message: 'Logged in successfully', userId: user.id, token, chatId: chat.id });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error });
  }
}
