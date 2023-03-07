import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { ShopLayout } from '@/layouts';
import { countries } from '@/constants';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useMemo } from 'react';
import { CartContext } from '@/context';

type FormData = {
  firstname: string;
  lastname: string;
  address: string;
  address2?: string;
  zipcode: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = () => {
  return {
    firstname: Cookies.get('firstname') || '',
    lastname: Cookies.get('lastname') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    zipcode: Cookies.get('zipcode') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || ''
  };
};

const AddressPage = () => {
  const router = useRouter();
  const { updateShippingAddress, shippingAddress } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies()
  });

  const initialCountry = useMemo(() => Cookies.get('country') || '', []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!shippingAddress) return <></>;

  const onRegisterForm = async (formData: FormData) => {
    updateShippingAddress(formData);
    router.push('/checkout/summary');
  };

  return (
    <ShopLayout title="Direccion" pageDescription="Confirmar direccion de entrega">
      <Typography variant="h1" component="h1">
        Direccion
      </Typography>
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              error={!!errors.firstname}
              helperText={errors.firstname?.message}
              {...register('firstname', { required: 'El nombre es requerido' })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              error={!!errors.lastname}
              helperText={errors.lastname?.message}
              {...register('lastname', { required: 'El apellido es requerido' })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Direccion"
              variant="filled"
              fullWidth
              error={!!errors.address}
              helperText={errors.address?.message}
              {...register('address', { required: 'La direccion es requerida' })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Direccion2 (opcional)"
              variant="filled"
              fullWidth
              error={!!errors.address2}
              helperText={errors.address2?.message}
              {...register('address2')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Codigo Postal"
              variant="filled"
              fullWidth
              error={!!errors.zipcode}
              helperText={errors.zipcode?.message}
              {...register('zipcode', { required: 'El codigo postal es requerido' })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              error={!!errors.city}
              helperText={errors.city?.message}
              {...register('city', { required: 'La ciudad es requerida' })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                variant="filled"
                label="pais"
                defaultValue={initialCountry}
                error={!!errors.country}
                helperText={errors.country?.message}
                {...register('country', { required: 'El pais es requerido' })}>
                {countries.map((country) => (
                  <MenuItem value={country.code} key={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Telefono"
              variant="filled"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
              {...register('phone', { required: 'El telefono es requerido' })}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button color="secondary" className="circular-btn" size="large" type="submit">
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token = '' } = req.cookies;
//   let isValidToken = false;

//   try {
//     await jwtUtils.isValidToken(token);
//     isValidToken = true;
//   } catch (error) {
//     /* empty */
//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false
//       }
//     };
//   }

//   return {
//     props: {}
//   };
// };

export default AddressPage;
