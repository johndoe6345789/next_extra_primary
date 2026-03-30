'use client';

import React from 'react';
import Box from '@metabuilder/m3/Box';
import Typography from '@metabuilder/m3/Typography';
import MuiLink from '@metabuilder/m3/Link';
import Container from '@metabuilder/m3/Container';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

/** Props for the Footer organism. */
export interface FooterProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Footer with copyright and nav links.
 *
 * @param props - Component props.
 */
export const Footer: React.FC<FooterProps> = ({ testId = 'footer' }) => {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const links = [
    { labelKey: 'about' as const, href: '/about' },
    { labelKey: 'contact' as const, href: '/contact' },
  ];
  return (
    <Box
      component="footer"
      role="contentinfo"
      data-testid={testId}
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          data-testid="footer-copyright"
        >
          &copy; {new Date().getFullYear()} {tCommon('appName')}
        </Typography>
        <Box
          component="nav"
          aria-label="Footer navigation"
          sx={{ display: 'flex', gap: 2 }}
        >
          {links.map((l) => (
            <MuiLink
              key={l.href}
              component={Link}
              href={l.href}
              color="text.secondary"
              underline="hover"
              variant="body2"
              tabIndex={0}
              data-testid={`footer-${l.labelKey}`}
            >
              {tNav(l.labelKey)}
            </MuiLink>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
