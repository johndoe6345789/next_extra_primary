'use client';

import React from 'react';
import TextField from '@shared/m3/TextField';
import {
  RegisterPasswordFields,
} from './registerPasswordFields';
import type { RegisterFieldsProps }
  from './registerFormTypes';

export type {
  RegisterFieldsProps, RegFields,
} from './registerFormTypes';

/**
 * Five registration text fields.
 *
 * @param props - Component props.
 */
export const RegisterFormFields: React.FC<
  RegisterFieldsProps
> = ({ f, set, errors, labels }) => (
  <>
    <div className="form-field">
      <TextField
        label={labels.username}
        value={f.username}
        onChange={set('username')}
        required
        error={!!errors.username}
        helperText={errors.username}
        testId="register-username"
      />
    </div>
    <div className="form-field">
      <TextField
        label={labels.email}
        value={f.email}
        onChange={set('email')}
        type="email"
        required
        error={!!errors.email}
        helperText={errors.email}
        testId="register-email"
      />
    </div>
    <div className="form-field">
      <TextField
        label={labels.displayName}
        value={f.displayName}
        onChange={set('displayName')}
        required
        error={!!errors.displayName}
        helperText={errors.displayName}
        testId="register-displayname"
      />
    </div>
    <RegisterPasswordFields
      f={f}
      set={set}
      errors={errors}
      labels={labels}
    />
  </>
);

export default RegisterFormFields;
