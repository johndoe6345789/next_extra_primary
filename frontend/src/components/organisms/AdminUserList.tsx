'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useAdminUsers }
  from '@/hooks/useAdminUsers';
import UserRow from './UserRow';

/**
 * Admin user management table with role
 * editing and active/disable toggles.
 */
export const AdminUserList: React.FC = () => {
  const t = useTranslations('admin');
  const {
    users, setRole, toggleActive, impersonate,
  } = useAdminUsers();

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
            setRole(u.id, role)}
          onToggleActive={() =>
            toggleActive(u.id, u.isActive)}
          onImpersonate={() =>
            impersonate(u.id)}
          t={t}
        />
      ))}
    </Box>
  );
};

export default AdminUserList;
