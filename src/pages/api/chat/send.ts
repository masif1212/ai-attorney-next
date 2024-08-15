import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chatId, query, userId } = req.body;

  if (!chatId || !query || !userId) {
    return res.status(400).json({ error: 'chatId, query, and userId are required' });
  }

  try {
    const response = await fetch('https://4977-2407-aa80-314-b639-2d00-975c-1d3a-86c1.ngrok-free.app/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, chat_id: chatId }),
    });

    if (!response.ok) {
      throw new Error(`Python API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    const resultOne = data.response; 
    const userMessage = await prisma.message.create({
      data: {
        chatId: chatId as string,
        senderId: userId, 
        content: query,
        senderType: 'user',
        messageType: 'QUERY',
        sequence: 1,
        pairId: uuidv4(),
      },
    });

    const aiMessage = await prisma.message.create({
      data: {
        chatId: chatId as string,
        senderId: null, 
        content: resultOne,
        senderType: 'AI',
        messageType: 'RESPONSE',
        sequence: 2,
        parentId: userMessage.id,
        pairId: userMessage.pairId,
      },
    });

    res.status(201).json({
      pair: {
        userMessage: {
          content: userMessage.content,
          senderType: userMessage.senderType,
          createdAt: userMessage.createdAt,
          pairId: userMessage.pairId,
        },
        aiMessage: {
          content: aiMessage.content,
          senderType: aiMessage.senderType,
          createdAt: aiMessage.createdAt,
          pairId: aiMessage.pairId,
        },
      },
    });

  } catch (error) {
    console.error("Error in /api/ask handler:", error);
    res.status(500).json({ error: `Failed to process the query: ${error}`});
  }
}