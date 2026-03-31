'use client';

import React from 'react';
import Alert from '@metabuilder/m3/Alert';
import Card from '@metabuilder/m3/Card';
import CardContent from '@metabuilder/m3/CardContent';
import Typography from '@metabuilder/m3/Typography';
import Box from '@metabuilder/m3/Box';
import MuiLink from '@metabuilder/m3/Link';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';
import { LoginFormFields } from './LoginFormFields';
import { useLoginForm } from '@/hooks/useLoginForm';

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
  const t = useTranslations('auth');
  const {
    email, setEmail, pw, setPw,
    isLoading, errors, apiError, submit,
  } = useLoginForm();

  return (
    <Card data-testid={testId} sx={{ maxWidth: 420, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" id="login-heading" gutterBottom>
          {t('login')}
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
          {apiError && (
            <Alert severity="error" data-testid="login-error">
              {apiError}
            </Alert>
          )}
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
            {isLoading ? t('signingIn') : t('login')}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <MuiLink component={Link} tabIndex={0} href="/forgot-password" variant="body2">
              {t('forgotPassword')}
            </MuiLink>
            <MuiLink component={Link} tabIndex={0} href="/register" variant="body2">
              {t('register')}
            </MuiLink>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
