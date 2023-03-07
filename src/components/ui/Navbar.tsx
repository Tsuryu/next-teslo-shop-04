/* eslint-disable jsx-a11y/anchor-is-valid */
import { ChangeEvent, useCallback, useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import {
  AppBar,
  Link,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Input,
  InputAdornment
} from '@mui/material';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import ClearOutlined from '@mui/icons-material/ClearOutlined';

import { CartContext, UIContext } from '@/context';

type Category = 'kids' | 'men' | 'women';

export const Navbar = () => {
  const router = useRouter();
  const { numberOfItems } = useContext(CartContext);
  const { toggleSideMenu } = useContext(UIContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const currentCategory: Category = router.pathname.replace('/category/', '') as Category;

  const isCurrentCategory = useCallback(
    (category: Category) => (currentCategory === category ? 'primary' : 'info'),
    [currentCategory]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    router.push(`/search/${searchTerm.trim()}`);
  };

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

        <Box sx={{ display: { xs: 'none', sm: isSearchVisible ? 'none' : 'block' } }} className="fadeIn">
          <NextLink href="/category/men" passHref>
            <Link component="span">
              <Button color={isCurrentCategory('men')}>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link component="span">
              <Button color={isCurrentCategory('women')}>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kids" passHref>
            <Link component="span">
              <Button color={isCurrentCategory('kids')}>Niños</Button>
            </Link>
          </NextLink>
        </Box>
        <Box flex={1} />

        {isSearchVisible ? (
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className="fadeIn"
            autoFocus
            value={searchTerm}
            onChange={handleChange}
            onKeyPress={(event) => event.key === 'Enter' && onSearchTerm()}
            type="text"
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }} onClick={() => setIsSearchVisible(true)}>
            <SearchOutlined />
          </IconButton>
        )}

        <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={toggleSideMenu}>
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <Link component="span">
            <IconButton>
              <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};

// <NextLink
//    href={ router.query.p ? `/auth/register?p=${ router.query.p }`: '/auth/register' }
// >
//     <Link underline='always' component={'span'}>
//         ¿No tienes cuenta?
//     </Link>
// </NextLink>
