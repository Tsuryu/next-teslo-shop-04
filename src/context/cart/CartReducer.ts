import { IShippingAddress } from '@/interfaces';
import { CartState, ICartProduct, ISummary } from './interfaces';

export type CartActionType =
  | {
      type: 'Cart - Load cart from storage';
      payload: ICartProduct[];
    }
  | {
      type: 'Cart - Add product' | 'Cart - Update product' | 'Cart - Remove product';
      payload: ICartProduct;
    }
  | {
      type: 'Cart - Update Summary';
      payload: ISummary;
    }
  | {
      type: 'Cart - Load shipping address from cookies' | 'Cart - Update shipping address';
      payload: IShippingAddress;
    }
  | {
      type: 'Cart - Order created';
    };

export const CartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case 'Cart - Load cart from storage':
      return {
        ...state,
        cart: action.payload,
        isLoaded: true
      };
    case 'Cart - Add product': {
      const newProduct = action.payload;
      return {
        ...state,
        cart: state.cart.some(({ _id, size }) => _id === newProduct._id && size === newProduct.size)
          ? state.cart.map((cartProduct) =>
              cartProduct._id === newProduct._id && cartProduct.size === newProduct.size
                ? { ...cartProduct, quantity: cartProduct.quantity + newProduct.quantity }
                : cartProduct
            )
          : [...state.cart, newProduct]
      };
    }
    case 'Cart - Update product':
      return {
        ...state,
        cart: state.cart.map((cartProduct) =>
          cartProduct._id === action.payload._id && cartProduct.size === action.payload.size
            ? action.payload
            : cartProduct
        )
      };
    case 'Cart - Remove product':
      return {
        ...state,
        cart: state.cart.filter(
          (cartProduct) => cartProduct._id !== action.payload._id || cartProduct.size !== action.payload.size
        )
      };
    case 'Cart - Update Summary':
      return {
        ...state,
        ...action.payload
      };
    case 'Cart - Update shipping address':
    case 'Cart - Load shipping address from cookies':
      return {
        ...state,
        shippingAddress: action.payload
      };
    case 'Cart - Order created':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        total: 0,
        tax: 0
      };
    default:
      return state;
  }
};
