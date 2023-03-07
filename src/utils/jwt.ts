/* eslint-disable prefer-promise-reject-errors */
import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No esta configurada la secret key del jwt');
  }

  return jwt.sign({ _id, email }, process.env.JWT_SECRET_SEED, {
    expiresIn: '30d'
  });
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No esta configurada la secret key del jwt');
  }

  if (token.length < 10) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('JWT no es valido');
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
        if (err) return reject('JWT invalido');

        // eslint-disable-next-line
        const { _id } = payload as { _id: string };
        resolve(_id);
      });
    } catch (error) {
      reject('JWT invalido');
    }
  });
};
