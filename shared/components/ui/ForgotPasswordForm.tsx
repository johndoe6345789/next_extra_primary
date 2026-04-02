'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import TextField from '@shared/m3/TextField';
import MuiLink from '@shared/m3/Link';
import { Button } from '@shared/m3/Button';
import type { ForgotPasswordFormProps }
  from './forgotPasswordTypes';
import s from
  '@shared/scss/modules/ForgotPasswordForm.module.scss';

export type { ForgotPasswordFormProps }
  from './forgotPasswordTypes';

type CE = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

/** Forgot password card with email field. */
export const ForgotPasswordForm: React.FC<
  ForgotPasswordFormProps
> = ({
  email, setEmail, isLoading, success,
  apiError, submit, labels, links,
  testId = 'forgot-password-form',
}) => (
  <div className={s.root} data-testid={testId}>
    <h2 id="forgot-heading">
      {labels.resetPassword}
    </h2>
    <p className="text-text.secondary mb-md">
      {labels.resetInstructions}
    </p>
    <form
      role="form"
      aria-labelledby="forgot-heading"
      onSubmit={submit}
    >
      {apiError && (
        <Alert severity="error" testId="forgot-error">
          {apiError}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          testId="forgot-success"
        >
          {labels.resetSent}
        </Alert>
      )}
      <div className={s.field}>
        <TextField
          label={labels.email}
          type="email"
          value={email}
          onChange={
            (e: CE) => setEmail(e.target.value)
          }
          required
          fullWidth
          autoComplete="email"
        />
      </div>
      <Button
        type="submit"
        fullWidth
        disabled={isLoading}
        testId="forgot-submit"
      >
        {isLoading
          ? labels.sending
          : labels.resetPassword}
      </Button>
      <div className={s.links}>
        <MuiLink
          href={links?.login ?? '/login'}
          variant="body2"
          tabIndex={0}
        >
          {labels.backToLogin}
        </MuiLink>
      </div>
    </form>
  </div>
);

export default ForgotPasswordForm;
