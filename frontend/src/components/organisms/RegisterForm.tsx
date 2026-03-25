'use client';

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';
import { RegisterFormFields } from './RegisterFormFields';
import { useRegisterForm } from '@/hooks/useRegisterForm';

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
  const t = useTranslations('auth');
  const { f, set, isLoading, errors, submit } = useRegisterForm();

  return (
    <Card data-testid={testId} sx={{ maxWidth: 420, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" id="register-heading" gutterBottom>
          {t('register')}
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
            {isLoading ? t('creating') : t('register')}
          </Button>
          <MuiLink
            component={Link}
            href="/login"
            variant="body2"
            tabIndex={0}
            sx={{ textAlign: 'center' }}
          >
            {t('hasAccount')}
          </MuiLink>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
