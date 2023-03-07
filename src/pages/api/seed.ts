import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/database';
import { initialData } from '@/database/seed-data';
import { Product, User } from '@/models';

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'Not authorized' });
  }

  await db.connect();
  await User.deleteMany();
  await User.insertMany(initialData.users);
  await Product.deleteMany();
  await Product.insertMany(initialData.products);
  await db.disconnect();
  res.status(200).json({ message: 'Database initialized' });
}
