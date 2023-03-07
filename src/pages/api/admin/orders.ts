import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/database';
import { Order } from '@/models';
import { IOrder } from '@/interfaces';

type Data =
  | {
      message: string;
    }
  | IOrder[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      getOrders(req, res);
      break;
    default:
      res.status(501).json({ message: 'Not implemented yet' });
      break;
  }
}
const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const orders = await Order.find({}).sort({ createdAt: 'desc' }).populate('user', 'name email').lean();
  await db.disconnect();

  res.status(200).json(orders);
};
