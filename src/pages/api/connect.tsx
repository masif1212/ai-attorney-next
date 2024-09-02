import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  
  try {
    const connection = await connectToDatabase();
    console.log('Connection object:');

    if (connection) {
      res.status(200).json({ message: 'Database connected successfully' });
    } else {
      res.status(500).json({ message: 'Failed to connect to the database' });
    }
  } catch (error) {
    console.error('Error during connection:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export default handler;

