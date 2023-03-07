import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';

import { ShopLayout } from '@/layouts';
import { CartList, OrderSummary } from '@/components/cart';
import NextLink from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/context';
import { countries } from '@/constants';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Chip from '@mui/material/Chip';

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
  const { firstname, lastname, address, address2, city, zipcode, country, phone } = shippingAddress ?? {};
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!Cookies.get('firstname')) {
      router.push('/checkout/address');
    }
  }, [router]);

  const handleCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();
    if (hasError) {
      setErrorMessage(message);
      setIsPosting(false);
      return;
    }

    router.replace(`/orders/${message}`);
  };

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!shippingAddress) return <></>;

  return (
    <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Carro
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable={false} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems} producto{numberOfItems > 1 && 's'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Direccion de entrega</Typography>
                <NextLink href="/checkout/address" legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <Typography>
                {firstname} {lastname}
              </Typography>
              <Typography>
                {address}
                {address2 && `, ${address2}`}
              </Typography>
              <Typography>
                {city}, {zipcode}
              </Typography>
              <Typography>{countries.find(({ code }) => code === country)?.name ?? ''}</Typography>
              <Typography>{phone}</Typography>
              <Divider sx={{ my: 1 }} />

              <Box
                display="flex"
                justifyContent="end
              ">
                <NextLink href="/cart" legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={handleCreateOrder}
                  disabled={isPosting}>
                  Confirmar Orden
                </Button>
                <Chip color="error" label={errorMessage} sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
