'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import MuiLink from '@shared/m3/Link';
import { Button } from '@shared/m3/Button';
import { RegisterFormFields }
  from './RegisterFormFields';
import type { RegisterFormProps }
  from './registerFormTypes';
import s from '@shared/scss/modules/LoginForm.module.scss';

export type { RegisterFormProps }
  from './registerFormTypes';

/**
 * Registration card with fields and login link.
 *
 * @param props - Component props.
 */
export const RegisterForm: React.FC<
  RegisterFormProps
> = ({
  f, set, isLoading, errors, apiError,
  submit, labels, links,
  testId = 'register-form',
}) => (
  <div className={s.root} data-testid={testId}>
    <h2 id="register-heading">{labels.register}</h2>
    <form
      role="form"
      aria-labelledby="register-heading"
      onSubmit={submit}
    >
      {apiError && (
        <Alert severity="error" testId="register-error">
          {apiError}
        </Alert>
      )}
      <RegisterFormFields
        f={f}
        set={set}
        errors={errors}
        labels={labels}
      />
      <Button
        type="submit"
        fullWidth
        disabled={isLoading}
        testId="register-submit"
      >
        {isLoading ? labels.creating : labels.register}
      </Button>
      <MuiLink
        href={links?.login ?? '/login'}
        variant="body2"
        tabIndex={0}
        className={s.links}
      >
        {labels.hasAccount}
      </MuiLink>
    </form>
  </div>
);

export default RegisterForm;
