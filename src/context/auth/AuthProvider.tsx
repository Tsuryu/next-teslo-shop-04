import { FC, PropsWithChildren, Reducer, useReducer, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

import axios from 'axios';
import Cookies from 'js-cookie';

import { tesloApi } from '@/api';
import { IUser } from '@/interfaces';
import { AuthContext } from './AuthContext';
import { AuthActionType, AuthReducer } from './AuthReducer';
import { AuthState } from './interfaces';

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<AuthState, AuthActionType>>(AuthReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch({ type: 'Auth - Login', payload: data?.user as IUser });
    }
  }, [data, status]);

  // custom auth
  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-use-before-define
  //   checkToken();
  // }, []);

  // const checkToken = async () => {
  //   if (!Cookies.get('token')) return;

  //   try {
  //     const { data } = await tesloApi.get('/user/validate-token');
  //     const { token, user } = data;

  //     Cookies.set('token', token);
  //     dispatch({
  //       type: 'Auth - Login',
  //       payload: user
  //     });
  //   } catch (error) {
  //     Cookies.remove('token');
  //   }
  // };

  const logginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data: responseData } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = responseData;

      Cookies.set('token', token);
      dispatch({
        type: 'Auth - Login',
        payload: user
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data: responseData } = await tesloApi.post('/user/register', { email, password, name });
      const { token, user } = responseData;

      Cookies.set('token', token);
      dispatch({
        type: 'Auth - Login',
        payload: user
      });

      return {
        hasError: false
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message
        };
      }

      return {
        hasError: true,
        message: 'No se pudo crear el usuario, intente de nuevo mas tarde'
      };
    }
  };

  const logout = () => {
    Cookies.remove('cart');
    Cookies.remove('firstname');
    Cookies.remove('lastname');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zipcode');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');
    signOut();
    // custom auth logout
    // router.reload();
    // Cookies.remove('token');
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <AuthContext.Provider value={{ ...state, logginUser, registerUser, logout }}>{children}</AuthContext.Provider>;
};
