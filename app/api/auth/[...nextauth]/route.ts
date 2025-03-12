import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: { email: string; password: string; }) {
        if (
          credentials?.email === 'admin@example.com' &&
          credentials?.password === 'password'
        ) {
          return { id: '1', name: 'Admin User', email: 'admin@example.com' };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET || 'some-strong-secret',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
