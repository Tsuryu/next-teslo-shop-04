import { GetServerSideProps } from 'next';

import { Box, Typography } from '@mui/material';

import { ShopLayout } from '@/layouts';
import { ProductList } from '@/components/products';
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

export default function SearchPage({ foundProducts, products, query }: Props) {
  return (
    <ShopLayout title="TesloShop - Search" pageDescription="Pagina de busqueda de producto">
      <Typography variant="h1" component="h1">
        Buscar Productos
      </Typography>
      {foundProducts ? (
        <Typography variant="h2" component="h2" sx={{ marginBottom: 1 }} textTransform="capitalize">
          Termino: {query}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" sx={{ mb: 1 }} component="h2">
            No se encontro ningun producto para
          </Typography>
          <Typography variant="h2" sx={{ ml: 1 }} component="h2" color="secondary" textTransform="capitalize">
            {query}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string };

  if (query.trim().length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  let foundProducts = true;

  let products = await dbProducts.getProductsByTerm(query);
  if (products.length === 0) {
    products = await dbProducts.getAllProducts();
    foundProducts = false;
  }

  return {
    props: {
      foundProducts,
      products,
      query
    }
  };
};
