import { db } from '@/database';
import { IProduct } from '@/interfaces';
import Product from '@/models/Product';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
  | {
      message: string;
    }
  | { products: IProduct[] };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return searchProducts(req, res);
    default:
      res.status(501).json({ message: 'Not implemented' });
  }
}

async function searchProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  let { word } = req.query;

  if (!word) res.status(400).json({ message: 'Invalid search param' });
  word = word!.toString().toLocaleLowerCase();

  await db.connect();
  const products = await Product.find({ $text: { $search: word } })
    .select('title images price inStock slug tags -_id')
    .lean();
  await db.disconnect();

  res.status(200).json({ products });
}
