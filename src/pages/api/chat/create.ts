
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticate } from '../../../backend/middleware/auth';

const createChat = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    const recentChat = await prisma.chat.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: true,
      },
    });

    if (recentChat && recentChat.messages.length === 0) {
      return res.status(200).json({ chatId: recentChat.id });
    }

    const newChat = await prisma.chat.create({
      data: {
        userId, 
      },
    });

    res.status(201).json({ chatId: newChat.id });
  } catch (error) {
    console.error('Error creating chat:', error); 
    res.status(500).json({ message: 'Error creating chat', error: error });
  }
};

export default authenticate(createChat);
