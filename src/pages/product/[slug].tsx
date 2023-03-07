import { useState, useContext } from 'react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { ProductSizeSelector, ProductSlideShow } from '@/components/products';
import { ItemCounter } from '@/components/ui';
import { IProduct, ISize } from '@/interfaces';
import { ShopLayout } from '@/layouts';
import { dbProducts } from '@/database';
import { ICartProduct } from '@/context/cart/interfaces';
import { CartContext } from '@/context';

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);
  const [cartProduct, setCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    inStock: product.inStock,
    quantity: 1
  });

  const handleSizeSelected = (size: ISize) => {
    setCartProduct((state) => ({
      ...state,
      size
    }));
  };

  const handleUpdateQuantity = (quantity: number) => {
    setCartProduct((state) => ({
      ...state,
      quantity
    }));
  };

  const handleAddProduct = () => {
    addProductToCart(cartProduct);
    router.push('/cart');
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                currentValue={cartProduct.quantity}
                onUpdateQuantity={handleUpdateQuantity}
                maxValue={product.inStock}
              />
              <ProductSizeSelector
                sizes={product.sizes}
                selectedSize={cartProduct.size}
                onSelectedSize={handleSizeSelected}
              />
            </Box>
            {product.inStock > 0 ? (
              <Button
                color="secondary"
                className="circular-btn"
                onClick={handleAddProduct}
                disabled={!cartProduct.size}>
                {cartProduct.size ? 'Agregar al carrito' : 'Seleccione una talla'}
              </Button>
            ) : (
              <Chip label="No hay disponibles" color="error" variant="outlined" />
            )}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripcion</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = '' } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     };
//   }

//   return {
//     props: {
//       product
//     }
//   };
// };

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await dbProducts.getAllProductSlugs();

  return {
    paths: slugs.map(({ slug }) => ({
      params: {
        slug
      }
    })),
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = (ctx.params?.slug ?? '') as string;
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: {
      product
    },
    revalidate: 86400 // 1 day
  };
};

export default ProductPage;
