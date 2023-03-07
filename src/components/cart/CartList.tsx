import { FC, useContext } from 'react';
import NextLink from 'next/link';

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';

import { CartContext } from '@/context';
import { ICartProduct } from '@/context/cart/interfaces';
import { IOrderItem } from '@/interfaces';
import { ItemCounter } from '../ui';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products = [] }) => {
  const { cart, removeCartProduct, updateCartQuantity } = useContext(CartContext);

  const handleUpdateQuantity = (product: ICartProduct, quantity: number) => {
    updateCartQuantity({
      ...product,
      quantity
    });
  };

  const productsToShow = products.length > 0 ? products : cart;

  return (
    <>
      {productsToShow.map((product) => (
        <Grid container key={product.slug + product.size} spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
              <Link>
                <CardActionArea>
                  <CardMedia image={product.image} component="img" sx={{ borderRadius: '5px' }} />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
              </Typography>
              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={(product as ICartProduct).inStock}
                  onUpdateQuantity={(quantity) => handleUpdateQuantity(product as ICartProduct, quantity)}
                />
              ) : (
                <Typography variant="h5">
                  {product.quantity} producto{product.quantity > 1 && 's'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={2} display="flex" alignItems="center" flexDirection="column">
            <Typography variant="subtitle1">${product.price}</Typography>
            {editable && (
              <Button variant="text" color="secondary" onClick={() => removeCartProduct(product as ICartProduct)}>
                Quitar
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
