'use client';

import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { Button } from '../atoms';
import { useAuth, useFormValidation } from '@/hooks';
import { RegisterFormFields } from './RegisterFormFields';
import { REG_RULES, type RegFields, type CE } from './registerRules';

/** Props for the RegisterForm organism. */
export interface RegisterFormProps {
  testId?: string;
}

/**
 * Registration card with fields and login link.
 *
 * @param props - Component props.
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  testId = 'register-form',
}) => {
  const [f, setF] = useState<RegFields>({
    username: '',
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });
  const { register, isLoading } = useAuth();
  const { validate, errors } = useFormValidation(REG_RULES);
  const set = (k: string) => (e: CE) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = Object.keys(REG_RULES).every((k) =>
      validate(k, f[k as keyof RegFields]),
    );
    if (f.password !== f.confirmPassword) return;
    if (!ok) return;
    await register({
      username: f.username,
      email: f.email,
      displayName: f.displayName,
      password: f.password,
    });
  };

  return (
    <Card data-testid={testId} sx={{ maxWidth: 420, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" id="register-heading" gutterBottom>
          Create Account
        </Typography>
        <Box
          component="form"
          role="form"
          aria-labelledby="register-heading"
          onSubmit={submit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <RegisterFormFields f={f} set={set} errors={errors} />
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            testId="register-submit"
          >
            {isLoading ? 'Creating...' : 'Register'}
          </Button>
          <MuiLink
            component={Link}
            href="/login"
            variant="body2"
            tabIndex={0}
            sx={{ textAlign: 'center' }}
          >
            Already have an account? Login
          </MuiLink>
        </Box>
      </CardContent>
    </Card>
  );
};
