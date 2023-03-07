/* eslint-disable @typescript-eslint/no-use-before-define */
import { db } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
  | {
      lowInventory: number;
      notPaidOrders: number;
      numberOfClients: number;
      numberOfOrders: number;
      numberOfProducts: number;
      paidOrders: number;
      productsWithNoInventory: number;
    }
  | { message: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      getDashboard(req, res);
      break;

    default:
      res.status(501).json({ message: 'Not implemented yet' });
      break;
  }
}
const getDashboard = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await db.connect();

    const [orders, numberOfClients, products] = await Promise.all([
      Order.find().select('isPaid'),
      User.count({ role: 'client' }),
      Product.find().select('inStock')
    ]);

    const { numberOfOrders, notPaidOrders, paidOrders } = orders.reduce(
      (prev, curr) => ({
        numberOfOrders: prev.numberOfOrders + 1,
        notPaidOrders: curr.isPaid ? prev.notPaidOrders : prev.notPaidOrders + 1,
        paidOrders: curr.isPaid ? prev.paidOrders + 1 : prev.paidOrders
      }),
      {
        numberOfOrders: 0,
        notPaidOrders: 0,
        paidOrders: 0
      }
    );

    const { lowInventory, numberOfProducts, productsWithNoInventory } = products.reduce(
      (prev, curr) => ({
        lowInventory: curr.inStock <= 10 ? prev.lowInventory + 1 : prev.lowInventory,
        numberOfProducts: prev.numberOfProducts + 1,
        productsWithNoInventory: curr.inStock === 0 ? prev.productsWithNoInventory + 1 : prev.productsWithNoInventory
      }),
      {
        lowInventory: 0,
        numberOfProducts: 0,
        productsWithNoInventory: 0
      }
    );

    await db.disconnect();

    res.status(200).json({
      lowInventory,
      notPaidOrders,
      numberOfClients,
      numberOfOrders,
      numberOfProducts,
      paidOrders,
      productsWithNoInventory
    });
  } catch (error) {
    await db.disconnect();
    res.status(400).json({ message: 'Dash unavailable' });
  }
};
