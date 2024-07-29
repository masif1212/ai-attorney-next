import { PrismaClient, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPassword } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password }: { email: string, password: string } = req.body;

    let user: User | null;

    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password!' });
      return;
    }

    let isValid: boolean;

    try {
      isValid = await verifyPassword(password, user.password);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (!isValid) {
      res.status(401).json({ message: 'Invalid email or password!' });
      return;
    }

    res.status(200).json({ message: 'Logged in successfully!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
