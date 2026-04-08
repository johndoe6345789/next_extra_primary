'use client';

import React from 'react';

interface AccountAvatarProps {
  isEditing: boolean;
}

/**
 * Avatar section with optional change button
 * shown in edit mode.
 */
export const AccountAvatar: React.FC<
  AccountAvatarProps
> = ({ isEditing }) => (
  <>
    <div>
      <div>
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe"
          alt="User avatar"
        />
      </div>
      {isEditing && (
        <button>Change Avatar</button>
      )}
    </div>
  </>
);
