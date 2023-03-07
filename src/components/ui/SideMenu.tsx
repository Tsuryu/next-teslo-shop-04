import { ChangeEvent, useContext, useState } from 'react';
import { useRouter } from 'next/router';

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined';
import EscalatorWarningOutlined from '@mui/icons-material/EscalatorWarningOutlined';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import FemaleOutlined from '@mui/icons-material/FemaleOutlined';
import MaleOutlined from '@mui/icons-material/MaleOutlined';
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined';

import { AuthContext, UIContext } from '@/context';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';

export const SideMenu = () => {
  const router = useRouter();
  const { isMenuOpen, toggleSideMenu } = useContext(UIContext);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');

  const navigateTo = (url: string) => {
    router.push(url);
    toggleSideMenu();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const onSearchTerm = () => {
    navigateTo(`/search/${searchTerm.trim()}`);
  };

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
      onClose={toggleSideMenu}>
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              value={searchTerm}
              onChange={handleChange}
              onKeyPress={(event) => event.key === 'Enter' && onSearchTerm()}
              type="text"
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={onSearchTerm}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {isLoggedIn && (
            <>
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary="Perfil" />
              </ListItem>

              <ListItem button onClick={() => navigateTo('/orders/history')}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary="Mis Ordenes" />
              </ListItem>
            </>
          )}

          <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/men')}>
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary="Hombres" />
          </ListItem>

          <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/women')}>
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary="Mujeres" />
          </ListItem>

          <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/kids')}>
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary="Niños" />
          </ListItem>

          {!isLoggedIn ? (
            <ListItem button onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary="Ingresar" />
            </ListItem>
          ) : (
            <>
              <ListItem button onClick={logout}>
                <ListItemIcon>
                  <LoginOutlined />
                </ListItemIcon>
                <ListItemText primary="Salir" />
              </ListItem>

              {user?.role === 'admin' && (
                <>
                  {/* Admin */}
                  <Divider />
                  <ListSubheader>Admin Panel</ListSubheader>
                  <ListItem button onClick={() => navigateTo('/admin')}>
                    <ListItemIcon>
                      <DashboardOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <CategoryOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Productos" onClick={() => navigateTo('/admin/products')} />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <ConfirmationNumberOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Ordenes" onClick={() => navigateTo('/admin/orders')} />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <AdminPanelSettings />
                    </ListItemIcon>
                    <ListItemText primary="Usuarios" onClick={() => navigateTo('/admin/users')} />
                  </ListItem>
                </>
              )}
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};
