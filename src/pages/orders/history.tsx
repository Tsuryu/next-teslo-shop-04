import { GetServerSideProps } from 'next';
import NextLink from 'next/link';

import { Typography, Grid, Chip, Link, Box } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import { ShopLayout } from '@/layouts';
import { getSession } from 'next-auth/react';
import { FC } from 'react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagado',
    description: 'Muestra informacion si esta pagada o no',
    width: 200,
    renderCell: (params: GridRenderCellParams) =>
      params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="Pendiente de pago" variant="outlined" />
      )
  },
  {
    field: 'details',
    headerName: 'Orden',
    width: 100,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <NextLink href={`/orders/${params.row._id}`} passHref legacyBehavior>
        <Link>
          <Box display="flex" alignItems="center" justifyContent="center">
            {params.row.paid ? (
              <CheckCircleOutlineOutlinedIcon color="success" />
            ) : (
              <ErrorOutlineOutlinedIcon color="error" />
            )}
            Ver detalle
          </Box>
        </Link>
      </NextLink>
    ),
    align: 'center',
    headerAlign: 'center'
  }
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: FC<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    fullname: `${order.shippingAddress.firstname} ${order.shippingAddress.lastname}`,
    _id: order._id
  }));

  return (
    <ShopLayout title="Historial de ordenes" pageDescription="Historial de ordernes del cliente">
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p/orders/history',
        permanent: false
      }
    };
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);

  return {
    props: {
      orders
    }
  };
};

export default HistoryPage;
