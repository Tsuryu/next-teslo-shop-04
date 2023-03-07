import { useState, useEffect } from 'react';
// import { useState, useContext } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders, LiteralUnion, ClientSafeProvider } from 'next-auth/react';

import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import Chip from '@mui/material/Chip';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '@/layouts';
import { validatorUtils } from '@/utils';
import Divider from '@mui/material/Divider';
import { BuiltInProviderType } from 'next-auth/providers';
// import { AuthContext } from '@/context';
type FormData = {
  email: string;
  password: string;
};

interface Props {
  authError: string;
}

const LoginPage = ({ authError }: Props) => {
  const router = useRouter();
  // const { logginUser } = useContext(AuthContext);
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  // get auth providers
  useEffect(() => {
    (async () => {
      setProviders(await getProviders());
    })();
  }, []);

  // show error
  useEffect(() => {
    if (authError) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [authError]);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);
    // const isValidLogin = await logginUser(email, password);

    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   return;
    // }

    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);
    await signIn('teslo-credentials', { email, password });
  };

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar sesion
              </Typography>
              <Chip
                label="Usuario o contraseña invalido"
                color="error"
                icon={<ErrorOutlineOutlined />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo"
                variant="filled"
                fullWidth
                {...register('email', { required: 'Este campo es requerido', validate: validatorUtils.isEmail })}
                type="email"
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
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Minimo 6 caracteres' }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button color="secondary" className="circular-btn" size="large" fullWidth type="submit">
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink href={`/auth/register?p=${router.query.p?.toString()}`} passHref legacyBehavior>
                <Link underline="always">Registrarse</Link>
              </NextLink>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end" flexDirection="column">
              <Divider sx={{ width: '100%', mb: 2 }} />
              {/* <NextLink href={`/auth/register?p=${router.query.p?.toString()}`} passHref legacyBehavior>
                <Link underline="always">Registrarse</Link>
              </NextLink> */}
              {providers &&
                Object.values(providers).map(
                  ({ id, name }) =>
                    id !== 'teslo-credentials' && (
                      <Button
                        key={id}
                        variant="outlined"
                        fullWidth
                        color="primary"
                        sx={{ mb: 1 }}
                        onClick={() => signIn(id)}>
                        {name}
                      </Button>
                    )
                )}
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

export default LoginPage;
