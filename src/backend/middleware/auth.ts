import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

declare module 'next' {
  interface NextApiRequest {
    userId?: string;
  }
}

export const authenticate = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token,'token')
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, "secret-key") as { userId: string };
      req.userId = decoded.userId;
      return handler(req, res);
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
};
