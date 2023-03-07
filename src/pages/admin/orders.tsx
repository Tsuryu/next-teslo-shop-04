import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined';

import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import useSWR from 'swr';

import { AdminLayout } from '@/layouts';
import { IOrder, IUser } from '@/interfaces';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Orden id',
    width: 250
  },
  {
    field: 'email',
    headerName: 'Correo',
    width: 250
  },
  {
    field: 'name',
    headerName: 'Nombre completo',
    width: 300
  },
  {
    field: 'total',
    headerName: 'Total',
    width: 300
  },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }: GridRenderCellParams) =>
      row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      )
  },
  {
    field: 'numberOfItems',
    headerName: 'No.Productos',
    align: 'center',
    width: 150
  },
  {
    field: 'check',
    headerName: 'Ver orden',
    renderCell: ({ row }: GridRenderCellParams) => (
      <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
        Ver orden
      </a>
    )
  },
  {
    field: 'createdAt',
    headerName: 'Creada en',
    width: 300
  }
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!data || error) return <></>;

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    numberOfItems: order.numberOfItems,
    createdAt: order.createdAt
  }));

  return (
    <AdminLayout title="Ordenes" subtitle="Gestion de ordenes" icon={<ConfirmationNumberOutlined />}>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
