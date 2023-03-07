/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { IOrder, IUser } from '@/interfaces';
import { db } from '@/database';
import { Order, Product } from '@/models';

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      createOrder(req, res);
      break;
    default:
      res.status(501).json({ message: 'Not implemented yet' });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, tax, subTotal, total } = req.body as IOrder;

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Debe estar autenticado para crear una orden' });

  const productsId = orderItems.map((product) => product._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsId } }).lean();

  // return res.status(201).json({ dbProducts, orderItems });
  try {
    if (tax !== Number(process.env.NEXT_PUBLIC_TAX_RATE) * subTotal)
      throw new Error('Verifique los ratios de la orden');
    dbProducts.forEach((product) => {
      const dbProduct = orderItems.find((item) => item._id === product._id.toString());
      if (!dbProduct || dbProduct.price !== product.price) throw new Error('Verifique el monto de la orden');
    });

    const { subTotal: dbSubTotal } = orderItems.reduce(
      (prev, { quantity, price }) => ({
        numberOfItems: prev.numberOfItems + quantity,
        subTotal: prev.subTotal + price * quantity
      }),
      {
        numberOfItems: 0,
        subTotal: 0
      }
    );

    if (dbSubTotal !== subTotal) throw new Error('Verifique los montos totales de la orden');
    const dbTotal = dbSubTotal * (1 + Number(process.env.NEXT_PUBLIC_TAX_RATE));
    if (total !== Math.round(dbTotal * 100) / 100) throw new Error('Verifique los montos de la orden');

    const { _id: userId } = session.user as IUser;
    const newOrder = new Order({
      ...req.body,
      isPaid: false,
      user: userId
    });
    newOrder.total = Math.round(newOrder.total * 100) / 100;

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    res.status(400).json({ message: error.message || 'Error en el servidor' });
  }
};
