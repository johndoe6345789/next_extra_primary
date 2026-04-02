'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import MuiLink from '@shared/m3/Link';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';
import { RegisterFormFields } from './RegisterFormFields';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import s from '@shared/scss/modules/LoginForm.module.scss';

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
    <div
      className={s.root}
      data-testid={testId}
    >
        <h2 id="register-heading">
          {t('register')}
        </h2>
        <form
          role="form"
          aria-labelledby="register-heading"
          onSubmit={submit}
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
            className={s.links}
          >
            {t('hasAccount')}
          </MuiLink>
        </form>
    </div>
  );
};

export default RegisterForm;
