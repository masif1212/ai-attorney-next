import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { format } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }, 
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const today = format(new Date(), 'yyyy-MM-dd');
    const todaysChats = chats.filter((chat: { messages: string | any[]; }) =>
      chat.messages.length > 0 && format(chat.messages[0].createdAt, 'yyyy-MM-dd') === today
    );

    const previousChats = chats.filter((chat: { messages: string | any[]; }) =>
      chat.messages.length > 0 && format(chat.messages[0].createdAt, 'yyyy-MM-dd') !== today
    );

    const formatChats = (chatArray: typeof chats) => chatArray.map((chat: { id: any; createdAt: any; messages: any[]; }) => ({
      id: chat.id,
      createdAt: chat.createdAt,
      latestMessage: chat.messages[0]?.content.slice(0, 20) || '',
      fullContext: chat.messages.map(message => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        senderType: message.senderType,
      })),
    }));

    res.status(200).json({
      today: formatChats(todaysChats),
      previous: formatChats(previousChats),
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history', error });
  }
}
