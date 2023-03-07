/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextApiRequest, NextApiResponse } from 'next';

import bcryptjs from 'bcryptjs';

import { db } from '@/database';
import { User } from '@/models';
import { jwtUtils, validatorUtils } from '@/utils';

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
      };
    };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res);
    default:
      return res.status(501).json({ message: 'Not implemented' });
  }
}

async function registerUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email = '', password = '', name = '' } = req.body as { email: string; password: string; name: string };

  if (password.length < 6) return res.status(400).json({ message: 'La contraseña debe de ser 6 caracteres o mas' });
  if (name.length < 2) return res.status(400).json({ message: 'El nombre debe de ser 2 caracteres o mas' });
  if (!validatorUtils.isValidEmail(email)) return res.status(400).json({ message: 'El email no es valido' });

  await db.connect();
  const user = await User.findOne({ email }).lean();

  if (user) {
    await db.disconnect();
    return res.status(400).json({ message: 'Correo o contraseña no validos' });
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcryptjs.hashSync(password),
    name,
    role: 'client'
  });

  try {
    await newUser.save({ validateBeforeSave: true });
    await db.disconnect();
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: 'Error inesperado' });
  }

  const { role, _id: id } = newUser;

  res.status(200).json({ token: jwtUtils.signToken(id, email), user: { role, name, email } });
}
