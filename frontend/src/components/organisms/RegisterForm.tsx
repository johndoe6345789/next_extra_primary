'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import Box from '@shared/m3/Box';
import MuiLink from '@shared/m3/Link';
import { Link } from '@/i18n/navigation';
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
  const {
    f, set, isLoading, errors, apiError, submit,
  } = useRegisterForm();

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
          {apiError && (
            <Alert severity="error" data-testid="register-error">
              {apiError}
            </Alert>
          )}
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
