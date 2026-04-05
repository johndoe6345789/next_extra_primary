'use client';

import React from 'react';
import NextLink from 'next/link';
import Alert from '@shared/m3/Alert';
import MuiLink from '@shared/m3/Link';
import { Button } from '@shared/m3/Button';
import { LoginFormFields } from './LoginFormFields';
import type { LoginFormProps } from './loginFormTypes';
import s from '@shared/scss/modules/LoginForm.module.scss';

export type { LoginFormProps } from './loginFormTypes';

/**
 * Login card with email, password, submit,
 * forgot password and register links.
 *
 * @param props - Component props.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  email, setEmail, pw, setPw,
  isLoading, errors, apiError, submit,
  labels, links, testId = 'login-form',
}) => (
  <div className={s.root} data-testid={testId}>
    <h2 id="login-heading">{labels.login}</h2>
    <form
      role="form"
      aria-labelledby="login-heading"
      onSubmit={submit}
    >
      {apiError && (
        <Alert severity="error" testId="login-error">
          {apiError}
        </Alert>
      )}
      <LoginFormFields
        email={email}
        pw={pw}
        setEmail={setEmail}
        setPw={setPw}
        errors={errors}
        labels={labels}
      />
      <Button
        type="submit"
        fullWidth
        disabled={isLoading}
        testId="login-submit"
      >
        {isLoading ? labels.signingIn : labels.login}
      </Button>
      <div className={s.links}>
        <MuiLink
          tabIndex={0}
          component={NextLink}
          href={
            links?.forgotPassword
            ?? '/forgot-password'
          }
          variant="body2"
        >
          {labels.forgotPassword}
        </MuiLink>
        <MuiLink
          tabIndex={0}
          component={NextLink}
          href={links?.register ?? '/register'}
          variant="body2"
        >
          {labels.register}
        </MuiLink>
      </div>
    </form>
  </div>
);

export default LoginForm;
