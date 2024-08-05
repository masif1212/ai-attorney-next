import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../../../backend/middleware/auth';

const prisma = new PrismaClient();

const listChats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userId = Number(req.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const chats = await prisma.chat.findMany({
      where: { userId },
      select: { id: true, createdAt: true },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error listing chats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default authenticate(listChats);
