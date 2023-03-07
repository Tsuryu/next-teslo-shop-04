import { IUser } from '@/interfaces';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}
