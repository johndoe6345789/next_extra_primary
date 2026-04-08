'use client';
/**
 * AccountSettings Component
 * User profile and account information
 */

import React, { useState, useCallback } from 'react';
import { testId } from '../accessibility';
import { AccountFormFields }
  from './AccountFormFields';
import { AccountInfoPanel }
  from './AccountInfoPanel';
import { AccountAvatar } from './AccountAvatar';
import { AccountActions } from './AccountActions';

export const AccountSettings: React.FC = () => {
  const [isEditing, setIsEditing] =
    useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    bio: 'Workflow enthusiast',
  });
  const [originalData] = useState(formData);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev, [name]: value,
      }));
    }, []
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error(
        'Failed to save profile:', error);
    } finally { setIsSaving(false); }
  }, []);

  const handleCancel = useCallback(() => {
    setFormData(originalData);
    setIsEditing(false);
  }, [originalData]);

  return (
    <section
      data-testid={testId.settingsPanel()}
      aria-label="Account settings">
      <h2 id="account-settings-title">
        Profile Information
      </h2>
      <AccountAvatar isEditing={isEditing} />
      <AccountFormFields
        formData={formData}
        isEditing={isEditing}
        onInputChange={handleInputChange} />
      <AccountActions
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel} />
      <AccountInfoPanel />
    </section>
  );
};

export default AccountSettings;
