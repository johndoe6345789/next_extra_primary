'use client';

import React from 'react';
import {
  Icon,
} from '@shared/m3/data-display/Icon';
import { useTranslations } from 'next-intl';
import toolLinks from
  '@/constants/tool-links.json';

const ICONS: Record<string, string> = {
  Email: 'email',
  Storage: 'storage',
  Inventory: 'inventory',
  CloudQueue: 'cloud',
};

/**
 * Tool links for the mobile drawer.
 * Opens external tool UIs in new tabs.
 */
export const DrawerToolLinks: React.FC = () => {
  const t = useTranslations('nav');
  return (
    <div data-testid="drawer-tools">
      <div className="list-subheader">
        {t('tools')}
      </div>
      {toolLinks.map((link) => (
        <a
          key={link.labelKey}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="list-item-button"
        >
          <span className="list-item-icon">
            <Icon size="sm" color="primary">
              {ICONS[link.icon]}
            </Icon>
          </span>
          <span className="list-item-text">
            {t(
              link.labelKey as
                | 'webmail'
                | 'pgadmin'
                | 'packageRepo'
                | 's3server',
            )}
          </span>
          <Icon size="xs">
            open_in_new
          </Icon>
        </a>
      ))}
    </div>
  );
};

export default DrawerToolLinks;
