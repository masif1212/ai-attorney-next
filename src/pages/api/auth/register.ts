import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, email, phone, password, linkedinUrl, facebookUrl }: { 
      name: string, 
      email: string, 
      phone: string, 
      password: string, 
      linkedinUrl?: string, 
      facebookUrl?: string 
    } = req.body;

    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (existingUser) {
      res.status(422).json({ message: 'User already exists!' });
      return;
    }

    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    try {
      await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          linkedinUrl,
          facebookUrl
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    res.status(201).json({ message: 'User created successfully!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
