/* eslint-disable jsx-a11y/anchor-is-valid */
import { ShopLayout } from '@/layouts';
import RemoveShoppingCartOutlined from '@mui/icons-material/RemoveShoppingCartOutlined';
import { Box, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

const EmptyPage = () => {
  return (
    <ShopLayout title="Carro vacio" pageDescription="No hay articulos agregados en tu carro de compras aun">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display="flex" flexDirection="column" alignSelf="center">
          <Typography>Su carro de compras esta vacio</Typography>
          <NextLink href="/" passHref legacyBehavior>
            <Link typography="h4" color="secondary">
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
