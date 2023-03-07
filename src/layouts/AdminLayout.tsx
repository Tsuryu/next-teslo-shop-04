import { FC, PropsWithChildren } from 'react';

import { SideMenu } from '@/components/ui';
import { AdminNavbar } from '@/components/admin';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  subtitle: string;
  icon?: JSX.Element;
}

export const AdminLayout: FC<PropsWithChildren<Props>> = ({ children, subtitle, icon, title }) => {
  return (
    <>
      <AdminNavbar />
      <SideMenu />
      <main style={{ margin: '80px auto', padding: '0px 30px' }}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon} {title}
          </Typography>
          <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
          <Box className="fadeIn">{children}</Box>
        </Box>
      </main>
    </>
  );
};
