import NextAuth, { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import GithubProvider from 'next-auth/providers/github';

// Define auth options separately with proper typing
const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
  }
};

// Create and export the handler
const handler = NextAuth(authOptions);

// Export the handler functions
export { handler as GET, handler as POST };

// Remove edge runtime configuration to use Node.js runtime instead 