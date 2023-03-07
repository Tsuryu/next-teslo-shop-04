import { Typography } from '@mui/material';

import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';
import { ShopLayout } from '@/layouts';

const KidsPage = () => {
  const { products, isLoading } = useProducts('/products?gender=kid');

  return (
    <ShopLayout title="Productos para niños" pageDescription="Pagina de productos filtrados solo para niños">
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h1" component="h2" sx={{ marginBottom: 1 }}>
        Todos los productos para niños
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidsPage;
