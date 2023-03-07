import { FC, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import CreditScoreOutlined from '@mui/icons-material/CreditScoreOutlined';
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined';

import { ShopLayout } from '@/layouts';
import { CartList, OrderSummary } from '@/components/cart';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { countries } from '@/constants';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { tesloApi } from '@/api';

interface OrderResponseBody {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'PAYER_ACTION_REQUIRED';
}

interface Props {
  order: IOrder;
}

const OrderPage: FC<Props> = ({ order }) => {
  const router = useRouter();
  const { shippingAddress } = order;
  const [isPaying, setIsPaying] = useState(false);

  const handleOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      // eslint-disable-next-line no-alert
      return alert('No se registro el pago en paypal');
    }

    setIsPaying(true);

    try {
      await tesloApi.post(`/orders/payments`, {
        transactionId: details.id,
        orderId: order._id
      });

      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.error(error);
    }
  };

  return (
    <ShopLayout title="Resumen de la orden" pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Order: {order._id}
      </Typography>
      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden ya fue pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}
      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({order.numberOfItems} producto{order.numberOfItems > 1 && 's'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Direccion de entrega</Typography>
              </Box>
              <Typography>
                {shippingAddress.firstname} {shippingAddress.lastname}
              </Typography>
              <Typography>
                {shippingAddress.address} {shippingAddress.address2 && `,  ${shippingAddress.address2}`}
              </Typography>
              <Typography>
                {shippingAddress.city}, {shippingAddress.zipcode}
              </Typography>
              <Typography>{countries.find((country) => country.code === shippingAddress.country)?.name}</Typography>
              <Typography>{shippingAddress.phone}</Typography>
              <Divider sx={{ my: 1 }} />

              <OrderSummary order={order} />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                  sx={{ display: isPaying ? 'flex' : 'none' }}>
                  <CircularProgress />
                </Box>

                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection="column">
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden ya fue pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.total.toString()
                              }
                            }
                          ]
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then(handleOrderCompleted);
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false
      }
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    };
  }

  return {
    props: {
      order
    }
  };
};

export default OrderPage;
