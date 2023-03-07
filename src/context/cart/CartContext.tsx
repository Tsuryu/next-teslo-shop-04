import { createContext } from 'react';

import { IShippingAddress } from '@/interfaces';
import { ICartProduct, ISummary } from './interfaces';

interface ContextProps extends ISummary {
  cart: ICartProduct[];
  isLoaded: boolean;
  shippingAddress?: IShippingAddress;
  addProductToCart: (product: ICartProduct) => void;
  createOrder: () => Promise<{ hasError: boolean; message: string }>;
  removeCartProduct: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  updateShippingAddress: (address: IShippingAddress) => void;
}

export const CartContext = createContext<ContextProps>({} as ContextProps);
