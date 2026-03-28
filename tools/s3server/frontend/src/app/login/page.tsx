'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent
  from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CloudIcon from '@mui/icons-material/Cloud';
import { LoginForm } from '@/components/organisms';
import labels from '@/constants/ui-labels.json';

/** @brief S3 login page. */
export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Stack
            alignItems="center"
            spacing={1}
            sx={{ mb: 3 }}
          >
            <CloudIcon
              color="primary"
              sx={{ fontSize: 48 }}
            />
            <Typography variant="h5">
              {labels.app.title}
            </Typography>
            <Typography color="text.secondary">
              {labels.login.title}
            </Typography>
          </Stack>
          <LoginForm />
        </CardContent>
      </Card>
    </Box>
  );
}
