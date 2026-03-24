'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import Container from '@mui/material/Container';
import Link from 'next/link';

const LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
];

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
export const Footer: React.FC<FooterProps> = ({
  testId = 'footer',
}) => (
  <Box
    component="footer" role="contentinfo"
    data-testid={testId}
    sx={{
      py: 3, px: 2, mt: 'auto',
      borderTop: 1, borderColor: 'divider',
    }}
  >
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center', gap: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        data-testid="footer-copyright"
      >
        &copy; {new Date().getFullYear()} NextExtra
      </Typography>
      <Box
        component="nav"
        aria-label="Footer navigation"
        sx={{ display: 'flex', gap: 2 }}
      >
        {LINKS.map((l) => (
          <MuiLink
            key={l.href} component={Link}
            href={l.href}
            color="text.secondary"
            underline="hover" variant="body2"
            tabIndex={0}
            data-testid={
              `footer-${l.label.toLowerCase()}`
            }
          >
            {l.label}
          </MuiLink>
        ))}
      </Box>
    </Container>
  </Box>
);

export default Footer;
