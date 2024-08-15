import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { chatId } = req.query;

    if (!chatId || typeof chatId !== 'string') {
        return res.status(400).json({ message: 'chatId is required' });
    }

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: 'No chat history found' });
        }
        const chatHistory = chat.messages.map(message => ({
            message: message.content,
            type: message.senderType,
        }));

        console.log(chatHistory,"chat history");
        res.status(200).json({ chat_history: chatHistory });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Error fetching chat history', error });
    }
}