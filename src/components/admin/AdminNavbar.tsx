import { useContext } from 'react';
import NextLink from 'next/link';

import { AppBar, Link, Toolbar, Typography, Button, Box } from '@mui/material';

import { UIContext } from '@/context';

export const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UIContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref style={{ textDecoration: 'none' }}>
          <Link component="span" display="flex" alignItems="center">
            <Typography variant="h6">Teslo | </Typography>
            <Typography sx={{ marginLeft: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        <Box flex={1} />
        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
