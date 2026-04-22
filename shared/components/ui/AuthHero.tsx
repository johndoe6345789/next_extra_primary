import React from 'react';
import {
  Icon,
} from '@shared/m3/data-display/Icon';
import { getTranslations } from 'next-intl/server';
import s from '@shared/scss/modules/AuthHero.module.scss';

const FEATURES = [
  { icon: 'emoji_events', key: 'f1' },
  { icon: 'psychology', key: 'f2' },
  { icon: 'shield', key: 'f3' },
  { icon: 'speed', key: 'f4' },
] as const;

/**
 * Marketing hero panel for auth pages.
 */
export const AuthHero = async (): Promise<React.JSX.Element> => {
  const t = await getTranslations('authHero');
  return (
    <div className={s.root}>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <ul>
        {FEATURES.map(({ icon, key }) => (
          <li key={key}>
            <Icon size="sm">{icon}</Icon>
            {t(key)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthHero;
