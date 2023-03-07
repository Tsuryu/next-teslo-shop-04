/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/database';
import Product from '@/models/Product';
import { IProduct } from '@/interfaces';

type Data =
  | {
      message: string;
    }
  | { product: IProduct };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProduct(req, res);
    default:
      res.status(501).json({ message: 'Not implemented' });
  }
}

async function getProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { slug } = req.query;

  await db.connect();
  const product = await Product.findOne({ slug }).select('title images prices inStock slug').lean();
  await db.disconnect();

  if (!product) return res.status(404).json({ message: 'Not found' });

  product.images = product.images.map((img) =>
    img.includes('http') ? img : `${process.env.HOST_NAME}/products/${img}`
  );

  res.status(200).json({ product });
}
