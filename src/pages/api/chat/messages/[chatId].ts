import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticate } from '../../../../backend/middleware/auth';

export default authenticate(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chatId } = req.query;

  if (!chatId || typeof chatId !== 'string') {
    return res.status(400).json({ message: 'Chat ID is required' });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }, 
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Error fetching chat messages', error });
  }
});
