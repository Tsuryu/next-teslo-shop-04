/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextApiRequest, NextApiResponse } from 'next';

// import bcryptjs from 'bcryptjs';

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
    case 'GET':
      return checkJWT(req, res);
    default:
      return res.status(501).json({ message: 'Not implemented' });
  }
}

async function checkJWT(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { token = '' } = req.cookies;

  let userId = '';

  try {
    userId = await jwtUtils.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: 'Token invalido' });
  }

  await db.connect();
  const user = await User.findById(userId).lean();
  await db.disconnect();

  if (!user) return res.status(400).json({ message: 'Usuario invalido' });

  const { role, name, email, _id: id } = user;

  res.status(200).json({ token: jwtUtils.signToken(id, email), user: { role, name, email } });
}
