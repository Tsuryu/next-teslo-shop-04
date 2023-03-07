// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

import { IUser } from '@/interfaces';

declare module 'next-auth' {
  interface Session {
    accessToken: string | undefined;
    user: User | AdapterUser | undefined | IUser;
  }
  interface DefaultUser extends IUser {
    id?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string | undefined;
    user: User | AdapterUser | undefined | IUser;
  }
}
