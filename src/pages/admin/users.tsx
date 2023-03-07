import { useState, useEffect } from 'react';

import { Grid, MenuItem, Select } from '@mui/material';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import useSWR from 'swr';

import { AdminLayout } from '@/layouts';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!data && !error) return <></>;

  const handleRoleUpdated = async (userId: string, role: string) => {
    const prevUsers = [...users];
    const updatedUsers = users.map((user) => ({ ...user, role: user._id === userId ? role : user.role }));
    setUsers(updatedUsers);

    try {
      await tesloApi.put('/admin/users', {
        userId,
        role
      });
    } catch (e) {
      setUsers(prevUsers);
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Select
          value={row.role}
          label="Rol"
          sx={{ width: '300px' }}
          onChange={(e) => handleRoleUpdated(row.id, e.target.value)}>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="client">Client</MenuItem>
          <MenuItem value="super-admin">Super Admin</MenuItem>
          <MenuItem value="dev">Dev</MenuItem>
        </Select>
      )
    }
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }));

  return (
    <AdminLayout title="Usuarios" subtitle="Manteniento de usuarios" icon={<PeopleOutlined />}>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
