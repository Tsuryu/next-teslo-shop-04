import { FC } from 'react';
import { GetServerSideProps } from 'next';

import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import CreditScoreOutlined from '@mui/icons-material/CreditScoreOutlined';
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined';

import { AdminLayout } from '@/layouts';
import { CartList, OrderSummary } from '@/components/cart';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { countries } from '@/constants';

interface Props {
  order: IOrder;
}

const OrderPage: FC<Props> = ({ order }) => {
  const { shippingAddress } = order;

  return (
    <AdminLayout title="Orden" subtitle="Resumen de la orden">
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

              <Box sx={{ display: 'flex', flex: 1 }} flexDirection="column">
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/admin/orders/${id}`,
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

  return {
    props: {
      order
    }
  };
};

export default OrderPage;
