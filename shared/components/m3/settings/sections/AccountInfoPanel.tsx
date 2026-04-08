'use client';

import React from 'react';

/**
 * Read-only account information panel showing
 * creation date, last login, and active sessions.
 */
export const AccountInfoPanel: React.FC = () => (
  <div
    role="region"
    aria-label="Account information"
  >
    <h3>Account Information</h3>
    <div>
      <span>Account Created:</span>
      <span>January 15, 2024</span>
    </div>
    <div>
      <span>Last Login:</span>
      <span>Today at 2:34 PM</span>
    </div>
    <div>
      <span>Active Sessions:</span>
      <span>2</span>
    </div>
  </div>
);

export default AccountInfoPanel;
