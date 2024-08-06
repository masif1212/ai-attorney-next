// pages/api/chat/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticate } from '../../../backend/middleware/auth';

const getChats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Ensure req.userId is a number
    const userId = Number(req.userId);

    if (isNaN(userId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const chats = await prisma.chat.findMany({
      where: { userId: userId },
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats', error });
  }
};

export default authenticate(getChats);
