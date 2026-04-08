'use client';

import React from 'react';
import type { AccountFormFieldsProps }
  from './accountFormTypes';

export type {
  AccountFormData,
  AccountFormFieldsProps,
} from './accountFormTypes';

/** Form fields for account profile. */
export const AccountFormFields: React.FC<
  AccountFormFieldsProps
> = ({ formData, isEditing, onInputChange }) => (
  <>
    <div>
      <label htmlFor="fullName">
        Full Name
      </label>
      <input id="fullName" type="text"
        name="fullName"
        value={formData.fullName}
        onChange={onInputChange}
        disabled={!isEditing} />
    </div>
    <div>
      <label htmlFor="email">
        Email Address
      </label>
      <input id="email" type="email"
        name="email" value={formData.email}
        onChange={onInputChange}
        disabled={!isEditing} />
      <p>
        Your email is used for login and
        notifications
      </p>
    </div>
    <div>
      <label htmlFor="username">
        Username
      </label>
      <input id="username" type="text"
        name="username"
        value={formData.username}
        onChange={onInputChange}
        disabled={!isEditing} />
      <p>
        Your unique identifier
      </p>
    </div>
    <div>
      <label htmlFor="bio">Bio</label>
      <textarea id="bio" name="bio"
        value={formData.bio}
        onChange={onInputChange}
        disabled={!isEditing}
        rows={4} />
      <p>Tell us about yourself (optional)</p>
    </div>
  </>
);

export default AccountFormFields;
