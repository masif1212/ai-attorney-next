import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    res.status(200).json({ message: 'Database connected successfully' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed', error: error, stack: error });
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
