'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import {
  useListAdminUsersQuery,
  useSetUserRoleMutation,
  useSetUserActiveMutation,
} from '@/store/api/adminApi';
import UserRow from './UserRow';

/**
 * Admin user management table with role
 * editing and active/disable toggles.
 */
export const AdminUserList: React.FC = () => {
  const t = useTranslations('admin');
  const { data } = useListAdminUsersQuery({
    page: 1, perPage: 50,
  });
  const [setRole] = useSetUserRoleMutation();
  const [setActive] =
    useSetUserActiveMutation();

  const users = data?.data ?? [];

  return (
    <Box data-testid="admin-user-list">
      {users.length === 0 && (
        <Typography color="text.secondary">
          {t('noUsers')}
        </Typography>
      )}
      {users.map((u) => (
        <UserRow
          key={u.id} user={u}
          onRoleChange={(role) =>
            setRole({ id: u.id, role })}
          onToggleActive={() =>
            setActive({
              id: u.id,
              active: !u.isActive,
            })}
          t={t}
        />
      ))}
    </Box>
  );
};

export default AdminUserList;
