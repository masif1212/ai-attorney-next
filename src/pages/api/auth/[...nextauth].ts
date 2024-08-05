
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user) {
          // Validate the password and other credentials
          // if (isValidPassword(credentials?.password, user.password)) {
          return user;
          // }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
