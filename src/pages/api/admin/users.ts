/* eslint-disable @typescript-eslint/no-use-before-define */
import { db } from '@/database';
import { IUser } from '@/interfaces';
import { User } from '@/models';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
  | {
      message: string;
    }
  | IUser[]
  | IUser;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      getUsers(req, res);
      break;
    case 'PUT':
      updateUser(req, res);
      break;
    default:
      res.status(501).json({ message: 'Not implemented' });
      break;
  }
}
const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const users = await User.find().select('-password').lean();
  await db.disconnect();

  res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = '', role = '' } = req.body;

  if (!isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid id' });

  const validRoles = ['admin', 'super-admin', 'dev', 'client'];
  if (!validRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });

  await db.connect();
  const user = await User.findByIdAndUpdate(userId, {
    role
  }).select('-password');

  if (!user) return res.status(400).json({ message: 'Invalid user' });

  await db.disconnect();

  res.status(200).json(user);
};
