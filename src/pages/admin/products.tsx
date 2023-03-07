import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined';

import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import NextLink from 'next/link';

import { AdminLayout } from '@/layouts';
import { IProduct } from '@/interfaces';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Foto',
    renderCell: ({ row }: GridRenderCellParams) => (
      <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
        <CardMedia component="img" className="fadeIn" image={row.img} alt={row.title} />
      </a>
    )
  },
  {
    field: 'title',
    headerName: 'Titulo',
    width: 250,
    renderCell: ({ row }: GridRenderCellParams) => (
      <NextLink href={`/admin/products/${row.slug}`} passHref legacyBehavior>
        <Link underline="always">{row.title}</Link>
      </NextLink>
    )
  },
  { field: 'gender', headerName: 'Genero' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 250 }
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!data || error) return <></>;

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
    slug: product.slug
  }));

  return (
    <AdminLayout title="Productos" subtitle="Gestion de productos" icon={<ConfirmationNumberOutlined />}>
      <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
        <Button startIcon={<AddCircleOutline />} href="/admin/products/new" color="secondary">
          Crear
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
