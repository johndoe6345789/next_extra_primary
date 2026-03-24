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
import { LoginFormFields } from './LoginFormFields';
import { LOGIN_RULES } from './loginRules';

/** Props for the LoginForm organism. */
export interface LoginFormProps {
  testId?: string;
}

/**
 * Login card with email, password, submit,
 * forgot password and register links.
 *
 * @param props - Component props.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  testId = 'login-form',
}) => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const { login, isLoading } = useAuth();
  const { validate, errors } = useFormValidation(LOGIN_RULES);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = validate('email', email) && validate('password', pw);
    if (ok) await login({ email, password: pw });
  };

  return (
    <Card data-testid={testId} sx={{ maxWidth: 420, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" id="login-heading" gutterBottom>
          Sign In
        </Typography>
        <Box
          component="form"
          role="form"
          aria-labelledby="login-heading"
          onSubmit={submit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <LoginFormFields
            email={email}
            pw={pw}
            setEmail={setEmail}
            setPw={setPw}
            errors={errors}
          />
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            testId="login-submit"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <MuiLink
              component={Link}
              tabIndex={0}
              href="/forgot-password"
              variant="body2"
            >
              Forgot password?
            </MuiLink>
            <MuiLink
              component={Link}
              tabIndex={0}
              href="/register"
              variant="body2"
            >
              Register
            </MuiLink>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
