
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '../../backend/middleware/auth';

const protectedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.userId;
  res.status(200).json({ message: `Hello user test ${userId}` });
};

export default authenticate(protectedHandler);
