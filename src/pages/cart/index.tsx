import { useContext, useEffect } from 'react';

import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { ShopLayout } from '@/layouts';
import { CartList, OrderSummary } from '@/components/cart';
import { CartContext } from '@/context';
import { useRouter } from 'next/router';

const CartPage = () => {
  const router = useRouter();
  const { isLoaded, cart } = useContext(CartContext);

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace('/cart/empty');
    }
  }, [cart, isLoaded, router]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isLoaded || cart.length === 0) return <></>;

  return (
    <ShopLayout title="Carro de compras" pageDescription="Detalle del carro de compras">
      <Typography variant="h1" component="h1">
        Carro
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Orden</Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth href="/checkout/address">
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
