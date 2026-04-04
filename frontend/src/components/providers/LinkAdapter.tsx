'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import {
  LinkProvider,
} from '@shared/components/ui/LinkContext';

/** Provides Next.js Link to shared components. */
export const LinkAdapter: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <LinkProvider component={Link}>
    {children}
  </LinkProvider>
);
