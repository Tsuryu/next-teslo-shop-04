import { FC, PropsWithChildren, Reducer, useEffect, useReducer, useState } from 'react';

import Cookies from 'js-cookie';

import { IOrder, IShippingAddress } from '@/interfaces';
import { tesloApi } from '@/api';
import axios from 'axios';
import { CartContext } from './CartContext';
import { CartActionType, CartReducer } from './CartReducer';
import { CartState, ICartProduct } from './interfaces';

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<CartState, CartActionType>>(CartReducer, CART_INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const cart: ICartProduct[] = JSON.parse(Cookies.get('cart') ?? '[]');
      dispatch({
        type: 'Cart - Load cart from storage',
        payload: cart
      });
    } catch (error) {
      dispatch({
        type: 'Cart - Load cart from storage',
        payload: []
      });
    }
  }, []);

  useEffect(() => {
    if (isLoading) return setIsLoading(false);
    Cookies.set('cart', JSON.stringify(state.cart));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cart]);

  useEffect(() => {
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const { numberOfItems, subTotal } = state.cart.reduce(
      (prev, { quantity, price }) => ({
        numberOfItems: prev.numberOfItems + quantity,
        subTotal: prev.subTotal + price * quantity
      }),
      {
        numberOfItems: 0,
        subTotal: 0
      }
    );

    const tax = subTotal * taxRate;
    const summary = {
      numberOfItems,
      subTotal,
      tax,
      total: subTotal + tax
    };

    dispatch({
      type: 'Cart - Update Summary',
      payload: summary
    });
  }, [state.cart]);

  useEffect(() => {
    const shippingAddress = {
      firstname: Cookies.get('firstname') || '',
      lastname: Cookies.get('lastname') || '',
      address: Cookies.get('address') || '',
      address2: Cookies.get('address2') || '',
      zipcode: Cookies.get('zipcode') || '',
      city: Cookies.get('city') || '',
      country: Cookies.get('country') || '',
      phone: Cookies.get('phone') || ''
    };

    dispatch({
      type: 'Cart - Load shipping address from cookies',
      payload: shippingAddress
    });
  }, []);

  const addProductToCart = (product: ICartProduct) => {
    dispatch({
      type: 'Cart - Add product',
      payload: product
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({
      type: 'Cart - Update product',
      payload: product
    });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({
      type: 'Cart - Remove product',
      payload: product
    });
  };

  const updateShippingAddress = (address: IShippingAddress) => {
    if (isLoading) return setIsLoading(false);
    Cookies.set('firstname', address.firstname);
    Cookies.set('lastname', address.lastname);
    Cookies.set('address', address.address);
    Cookies.set('address2', address.address2 ?? '');
    Cookies.set('zipcode', address.zipcode);
    Cookies.set('city', address.city);
    Cookies.set('country', address.country);
    Cookies.set('phone', address.phone);
    dispatch({
      type: 'Cart - Update shipping address',
      payload: address
    });
  };

  const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
    try {
      if (!state.shippingAddress) throw new Error('No hay direccion de entrega');

      const body: IOrder = {
        orderItems: state.cart.map((product) => ({
          ...product,
          size: product.size!
        })),
        shippingAddress: state.shippingAddress,
        numberOfItems: state.numberOfItems,
        subTotal: state.subTotal,
        tax: state.tax,
        total: state.total,
        isPaid: false
      };
      const { data } = await tesloApi.post<IOrder>('/orders', body);

      dispatch({ type: 'Cart - Order created' });
      return {
        hasError: false,
        message: data._id!
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message
        };
      }

      return {
        hasError: true,
        message: 'Error al crear el producto, contactese con el administrador'
      };
    }
  };

  return (
    <CartContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ ...state, addProductToCart, createOrder, removeCartProduct, updateCartQuantity, updateShippingAddress }}>
      {children}
    </CartContext.Provider>
  );
};
