import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '@/layouts';
import { validatorUtils } from '@/utils';
// import { tesloApi } from '@/api';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import { useState, useContext } from 'react';
import { AuthContext } from '@/context';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const [showError, setShowError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  const onRegisterForm = async (formData: FormData) => {
    setShowError(false);
    const { name, email, password } = formData;
    const { hasError } = await registerUser(name, email, password);
    // const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      // setErrorMessage(message!);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);

    await signIn('teslo-credentials', { email, password });
  };

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
              <Chip
                label="No se puede usar ese correo"
                color="error"
                icon={<ErrorOutlineOutlined />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant="filled"
                fullWidth
                {...register('name', {
                  required: 'El nombre es requerido',
                  minLength: { value: 2, message: 'Debe tener al menos 2 caracteres' }
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {...register('email', {
                  required: 'El email es requerido',
                  validate: validatorUtils.isEmail
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                variant="filled"
                fullWidth
                type="password"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button color="secondary" className="circular-btn" size="large" fullWidth type="submit">
                Registrarse
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink href={`/auth/login?p=${router.query.p?.toString()}`} passHref legacyBehavior>
                <Link underline="always">Ingresar</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  const { p = '/', error } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    };
  }

  return {
    props: {
      authError: error ?? ''
    }
  };
};

export default RegisterPage;
