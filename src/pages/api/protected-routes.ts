// pages/api/protected.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '../../backend/middleware/auth';  // Adjust the path as necessary

const protectedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.userId;
  res.status(200).json({ message: `Hello user ${userId}` });
};

export default authenticate(protectedHandler);
