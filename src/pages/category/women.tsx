import { Typography } from '@mui/material';

import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';
import { ShopLayout } from '@/layouts';

const WomenPage = () => {
  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title="Productos para mujeres" pageDescription="Pagina de productos filtrados solo para mujeres">
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h1" component="h2" sx={{ marginBottom: 1 }}>
        Todos los productos para mujeres
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
