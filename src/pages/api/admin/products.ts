/* eslint-disable @typescript-eslint/no-use-before-define */
import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

type Data =
  | {
      message: string;
    }
  | IProduct
  | IProduct[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    case 'PUT':
      return updateProduct(req, res);
    default:
      res.status(501).json({ message: 'Not implemented yet' });
      break;
  }
  res.status(200).json({ message: 'Example' });
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await Product.find().sort({ title: 'asc' }).lean();
  await db.disconnect();

  const updatedProducts = products.map((product) => {
    // eslint-disable-next-line no-param-reassign
    product.images = product.images.map((img) =>
      img.includes('http') ? img : `${process.env.HOST_NAME}/products/${img}`
    );
    return product;
  });

  res.status(200).json(updatedProducts);
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) return res.status(400).json({ message: 'Invalid images' });

  try {
    await db.connect();
    const dbProduct = await Product.findOne({ slug: req.body.slug });
    if (dbProduct) return res.status(400).json({ message: 'Invalid slug' });

    const product = new Product({ ...req.body });
    await product.save();
    await db.disconnect();

    if (!product) return res.status(400).json({ message: 'Invalid product' });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(500).json({ message: 'Unexpected error' });
  }
};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id: id = '', images = [] } = req.body as IProduct;

  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

  if (images.length < 2) return res.status(400).json({ message: 'Invalid images' });

  try {
    await db.connect();
    const product = await Product.findByIdAndUpdate(id, req.body).lean();
    await db.disconnect();

    if (!product) return res.status(400).json({ message: 'Invalid product' });
    product.images.forEach(async (img) => {
      if (!images.includes(img)) {
        const [fileId] = img.substring(img.lastIndexOf('/') + 1).split('.');
        await cloudinary.uploader.destroy(fileId);
      }
    });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    await db.disconnect();
    return res.status(500).json({ message: 'Unexpected error' });
  }
};
