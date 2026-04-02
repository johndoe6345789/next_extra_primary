'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  Footer as SharedFooter,
} from '@shared/components/ui/Footer';

/**
 * Frontend Footer wrapper that injects i18n
 * translations and Next.js routing into the
 * shared Footer component.
 */
export const Footer: React.FC = () => {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  const links = [
    {
      href: '/about',
      label: tNav('about'),
      testId: 'footer-about',
    },
    {
      href: '/contact',
      label: tNav('contact'),
      testId: 'footer-contact',
    },
  ];

  return (
    <SharedFooter
      appName={tCommon('appName')}
      links={links}
    />
  );
};

export default Footer;
