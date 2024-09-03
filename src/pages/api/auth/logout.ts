
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Session token is required' });
    }

    const session = await prisma.session.findUnique({
      where: { token: token },
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await prisma.session.update({
      where: { token: token },
      data: {
        expiresAt: new Date(), 
        isLoggedIn: false,
      },
      
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
