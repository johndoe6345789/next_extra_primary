'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CloudIcon from '@mui/icons-material/Cloud';
import Link from 'next/link';
import { useS3Auth } from '@/hooks';
import labels from '@/constants/ui-labels.json';
import routes from '@/constants/routes.json';

/**
 * @brief Top navigation bar with links + logout.
 */
export default function AppNavbar() {
  const { logout } = useS3Auth();

  return (
    <AppBar
      position="static"
      data-testid="app-navbar"
      aria-label="Main navigation"
    >
      <Toolbar>
        <CloudIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{ mr: 4 }}
        >
          {labels.app.title}
        </Typography>
        <Button
          color="inherit"
          component={Link}
          href={routes.dashboard}
        >
          {labels.nav.dashboard}
        </Button>
        <Button
          color="inherit"
          component={Link}
          href={routes.buckets}
        >
          {labels.nav.buckets}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          onClick={logout}
          aria-label={labels.nav.logout}
        >
          {labels.nav.logout}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
