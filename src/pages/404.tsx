import { ShopLayout } from '@/layouts';
import { Box, Typography } from '@mui/material';

const NotFoundPage = () => {
  return (
    <ShopLayout title="Page not found" pageDescription="No hay nada que mostrar aqui">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
        <Typography variant="h1" component="h1" fontSize={80} fontWeight={200}>
          404
        </Typography>
        <Typography
          variant="h1"
          component="h1"
          fontSize={80}
          fontWeight={200}
          marginLeft={2}
          sx={{ display: { xs: 'none', sm: 'block' } }}>
          |
        </Typography>
        <Typography marginLeft={5}>Nada que mostrar para esta ruta</Typography>
      </Box>
    </ShopLayout>
  );
};

export default NotFoundPage;
