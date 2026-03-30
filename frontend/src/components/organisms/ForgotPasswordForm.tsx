'use client';

import React from 'react';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MuiLink from '@mui/material/Link';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';
import { useForgotPassword } from '@/hooks/useForgotPassword';

/** Props for ForgotPasswordForm. */
export interface ForgotPasswordFormProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Forgot password card with email field.
 *
 * @param props - Component props.
 */
export const ForgotPasswordForm: React.FC<
  ForgotPasswordFormProps
> = ({ testId = 'forgot-password-form' }) => {
  const t = useTranslations('auth');
  const {
    email, setEmail,
    isLoading, success, apiError, submit,
  } = useForgotPassword();

  return (
    <Card
      data-testid={testId}
      sx={{ maxWidth: 420, mx: 'auto', mt: 4 }}
    >
      <CardContent>
        <Typography
          variant="h5"
          id="forgot-heading"
          gutterBottom
        >
          {t('resetPassword')}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {t('resetInstructions')}
        </Typography>
        <Box
          component="form"
          role="form"
          aria-labelledby="forgot-heading"
          onSubmit={submit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {apiError && (
            <Alert
              severity="error"
              data-testid="forgot-error"
            >
              {apiError}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              data-testid="forgot-success"
            >
              {t('resetSent')}
            </Alert>
          )}
          <TextField
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            testId="forgot-submit"
          >
            {isLoading
              ? t('sending')
              : t('resetPassword')}
          </Button>
          <MuiLink
            component={Link}
            href="/login"
            variant="body2"
            tabIndex={0}
            sx={{ textAlign: 'center' }}
          >
            {t('backToLogin')}
          </MuiLink>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
