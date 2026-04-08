'use client';

import { useState, useCallback } from 'react';
import React from 'react';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * State and handlers for password management.
 * @param onPasswordChanged - Success callback.
 * @returns Form state and actions.
 */
export function usePasswordSecurity(
  onPasswordChanged?: () => void
) {
  const [showForm, setShowForm] =
    useState(false);
  const [form, setForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isChanging, setIsChanging] =
    useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      setError('');
    }, []
  );

  const validatePassword =
    useCallback((): boolean => {
      if (form.newPassword !==
        form.confirmPassword) {
        setError('New passwords do not match');
        return false;
      }
      if (form.newPassword.length < 8) {
        setError('Password must be 8+ chars');
        return false;
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(
        form.newPassword
      )) {
        setError(
          'Must contain upper, lower, numbers'
        );
        return false;
      }
      return true;
    }, [form.newPassword, form.confirmPassword]);

  const handleChangePassword =
    useCallback(async () => {
      if (!validatePassword()) return;
      setIsChanging(true);
      try {
        await new Promise((r) =>
          setTimeout(r, 1500));
        setForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowForm(false);
        onPasswordChanged?.();
      } catch {
        setError('Failed to change password.');
      } finally { setIsChanging(false); }
    }, [validatePassword, onPasswordChanged]);

  return {
    showForm, setShowForm,
    form, error, isChanging,
    handleInputChange,
    handleChangePassword,
  };
}
