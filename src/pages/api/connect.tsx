import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const start = Date.now();
  try {
    console.log('Attempting to connect to the database...');
    
    const userCount = await prisma.user.count();

    const end = Date.now();
    console.log(`Database connected and query executed in ${end - start}ms`);

    res.status(200).json({ message: 'Database connected successfully', userCount });
  } catch (error) {
    console.error('Error during connection:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export default handler;
