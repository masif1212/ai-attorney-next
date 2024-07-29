// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { register } from '../../../lib/authHandlers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await register(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { login } from '../../../lib/authHandlers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await login(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
