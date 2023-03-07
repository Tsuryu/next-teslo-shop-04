import { IShippingAddress, ISize } from '@/interfaces';

export interface ICartProduct {
  _id: string;
  inStock: number;
  image: string;
  price: number;
  size?: ISize;
  slug: string;
  title: string;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  quantity: number;
}

export interface CartState extends ISummary {
  isLoaded: boolean;
  cart: ICartProduct[];
  shippingAddress?: IShippingAddress;
}

export interface ISummary {
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}
