/* eslint-disable no-param-reassign */
import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import credentials from 'next-auth/providers/credentials';
import { dbUsers } from '@/database';

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    credentials({
      id: 'teslo-credentials',
      name: 'Teslo login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' }
      },
      async authorize(credentialsParam) {
        const { email = '', password = '' } = credentialsParam ?? {};

        const user = await dbUsers.checkUserEmailPassword(email, password);
        if (!user) return null;

        return user;
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    })
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  session: {
    maxAge: 2592000, // monthly
    strategy: 'jwt',
    updateAge: 86400 // daily
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
            break;
          case 'credentials':
            token.user = user;
            break;

          default:
            break;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session; // The return type will match the one returned in `useSession()`
    }
  }
};

export default NextAuth(authOptions);
