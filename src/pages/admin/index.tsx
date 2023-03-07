import { Grid, Typography } from '@mui/material';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import CancelPresentationOutlined from '@mui/icons-material/CancelPresentationOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import AttachmoneyOutlined from '@mui/icons-material/AttachmoneyOutlined';
import ProductionQuantityLimitsOutlined from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import useSWR from 'swr';

import { SummaryTile } from '@/components/admin/SummaryTile';
import { AdminLayout } from '@/layouts';
import { useState, useEffect } from 'react';

interface DashboardSummaryResponse {
  lowInventory: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfOrders: number;
  numberOfProducts: number;
  paidOrders: number;
  productsWithNoInventory: number;
}

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000
  });
  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((state) => (state === 1 ? 30 : state - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (error) {
    console.error(error);
    return <Typography>Error cargando el dashboard</Typography>;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!data) return <></>;

  const {
    lowInventory,
    notPaidOrders,
    numberOfClients,
    numberOfOrders,
    numberOfProducts,
    paidOrders,
    productsWithNoInventory
  } = data;

  return (
    <AdminLayout title="Dashboard" subtitle="Estadisticas generales" icon={<DashboardOutlined />}>
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subtitle="Ordenes totales"
          icon={<CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={paidOrders}
          subtitle="Ordenes pagadas"
          icon={<AttachmoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={notPaidOrders}
          subtitle="Ordenes pendientes"
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfClients}
          subtitle="Clientes"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfProducts}
          subtitle="Productos"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={productsWithNoInventory}
          subtitle="Sin existencias"
          icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={lowInventory}
          subtitle="Bajo inventario"
          icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={refreshIn}
          subtitle="Actualizacion en"
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
