/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextApiRequest, NextApiResponse } from 'next';

import { db, SHOP_CONSTANTS } from '@/database';
import { IProduct } from '@/interfaces';
import Product from '@/models/Product';

type Data =
  | {
      message: string;
    }
  | {
      products: IProduct[];
    };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    default:
      res.status(501).json({ message: 'Not implemented' });
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { gender } = req.query;

  if (gender && !SHOP_CONSTANTS.validGenders.includes(`${gender}`))
    return res.status(400).json({ message: 'Invalid gender' });

  await db.connect();
  const products = await Product.find(req.query).select('title images prices inStock slug').lean();
  await db.disconnect();

  const updatedProducts = products.map((product) => {
    // eslint-disable-next-line no-param-reassign
    product.images = product.images.map((img) =>
      img.includes('http') ? img : `${process.env.HOST_NAME}/products/${img}`
    );
    return product;
  });

  res.status(200).json({ products: updatedProducts });
}
