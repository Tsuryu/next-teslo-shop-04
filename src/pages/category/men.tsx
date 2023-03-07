import { Typography } from '@mui/material';

import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';
import { ShopLayout } from '@/layouts';

const MenPage = () => {
  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title="Productos para hombres" pageDescription="Pagina de productos filtrados solo para hombres">
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h1" component="h2" sx={{ marginBottom: 1 }}>
        Todos los productos para hombres
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default MenPage;
