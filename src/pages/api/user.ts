import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '@/backend/middleware/auth';
import prisma from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default authenticate(handler);
