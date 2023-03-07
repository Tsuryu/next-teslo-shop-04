/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextApiRequest, NextApiResponse } from 'next';

import bcryptjs from 'bcryptjs';

import { db } from '@/database';
import { User } from '@/models';
import { jwtUtils } from '@/utils';

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
      return loginUser(req, res);
    default:
      return res.status(501).json({ message: 'Not implemented' });
  }
}

async function loginUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email = '', password = '' } = req.body;

  await db.connect();
  const user = await User.findOne({ email }).lean();
  await db.disconnect();

  if (!user) return res.status(400).json({ message: 'Correo o contraseña no validos' });

  if (!bcryptjs.compareSync(password, user.password!))
    return res.status(400).json({ message: 'Correo o contraseña no validos' });

  const { role, name, _id: id } = user;

  res.status(200).json({ token: jwtUtils.signToken(id, email), user: { role, name, email } });
}
