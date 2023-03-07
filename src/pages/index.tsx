import { Typography } from '@mui/material';

import { ShopLayout } from '@/layouts';
import { useProducts } from '@/hooks';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
// import { useSession } from 'next-auth/react';

export default function Home() {
  const { products, isLoading } = useProducts('/products');
  // const session = useSession();

  return (
    <ShopLayout title="TesloShop - Home" pageDescription="Pagina inicial de la app">
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" component="h2" sx={{ marginBottom: 1 }}>
        Todos los productos
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
