'use client';

import { useState } from 'react';
import {
  AppBar, Toolbar, Typography,
  Button, Box, IconButton,
  Cloud, Menu,
} from '@shared/m3';
import { useS3Auth } from '@/hooks';
import labels from '@/constants/ui-labels.json';
import routes from '@/constants/routes.json';
import SiteDrawer from './SiteDrawer';

/**
 * @brief Top navigation bar with burger menu,
 * links, and logout.
 */
export default function AppNavbar() {
  const { logout } = useS3Auth();
  const [drawerOpen, setDrawerOpen] =
    useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        data-testid="app-navbar"
        aria-label="Main navigation"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            edge="start"
            style={{ marginRight: 8 }}
          >
            <Menu />
          </IconButton>
          <Cloud style={{ marginRight: 8 }} />
          <Typography
            variant="h6"
            style={{ marginRight: 32 }}
          >
            {labels.app.title}
          </Typography>
          <Button
            color="inherit"
            href={routes.dashboard}
            size="small"
          >
            {labels.nav.dashboard}
          </Button>
          <Button
            color="inherit"
            href={routes.buckets}
            size="small"
          >
            {labels.nav.buckets}
          </Button>
          <Box style={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            onClick={logout}
            aria-label={labels.nav.logout}
            size="small"
          >
            {labels.nav.logout}
          </Button>
        </Toolbar>
      </AppBar>
      <SiteDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={logout}
      />
    </>
  );
}
