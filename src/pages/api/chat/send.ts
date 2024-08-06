import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticate } from '../../../backend/middleware/auth';
import { loadData } from '@/lib/loadData';
import initEmbeddings from '@/lib/initEmbeddings';

const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res.status(400).json({ message: 'Chat ID and content are required' });
  }

  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Optionally create the message in the database
    // const message = await prisma.message.create({
    //   data: {
    //     chatId,
    //     senderId: req.userId,
    //     content,
    //   },
    // });

    // Load data and initialize embeddings
    const data = await loadData();
    await initEmbeddings(data, res);

    // Respond to client
    res.status(201).json({ message: 'Message sent and embeddings updated' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error });
  }
};

export default authenticate(sendMessage);
