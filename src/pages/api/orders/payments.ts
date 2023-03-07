/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import { IPayPal } from '@/interfaces';
import { db } from '@/database';
import { Order } from '@/models';

type Data = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      payOrder(req, res);
      break;

    default:
      res.status(501).json({ message: 'Not implemented yet' });
      break;
  }
}

const getPaypalBearerToken = async () => {
  const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const SECRET = process.env.PAYPAL_SECRET;

  const base64Token = Buffer.from(`${CLIENT_ID}:${SECRET}`, 'utf-8').toString('base64');
  const body = new URLSearchParams('grant_type=client_credentials');

  try {
    const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
      headers: { Authorization: `Basic ${base64Token}`, 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    }
    console.error(error);
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const paypalBearerToken = await getPaypalBearerToken();

  if (!paypalBearerToken) {
    return res.status(400).json({ message: 'Error al hacer la peticion a paypal' });
  }

  const { transactionId = '', orderId = '' } = req.body;

  const { data } = await axios.get<IPayPal.PayPayOrderStatusResponse>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`
      }
    }
  );

  if (data.status !== 'COMPLETED') {
    return res.status(400).json({ message: 'Orden no es conocida' });
  }

  await db.connect();
  const dbOrder = await Order.findById(orderId);

  if (!dbOrder) {
    await db.disconnect();
    return res.status(400).json({ message: 'Orden desconocida' });
  }

  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    return res.status(400).json({ message: 'Pago irregular' });
  }

  dbOrder.transactionId = transactionId;
  dbOrder.isPaid = true;
  await dbOrder.save();

  await db.disconnect();

  res.status(200).json({ message: 'OK' });
};
