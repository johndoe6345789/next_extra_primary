'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CloudIcon from '@mui/icons-material/Cloud';
import { useS3Auth } from '@/hooks';
import labels from '@/constants/ui-labels.json';

/** @brief S3 login page. */
export default function LoginPage() {
  const { login } = useS3Auth();
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(accessKey, secretKey);
    if (!ok) setError(labels.login.error);
    setLoading(false);
  };

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
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                label={labels.login.accessKey}
                value={accessKey}
                onChange={(e) =>
                  setAccessKey(e.target.value)}
                data-testid="access-key-input"
                aria-label={labels.login.accessKey}
              />
              <TextField
                fullWidth
                type="password"
                label={labels.login.secretKey}
                value={secretKey}
                onChange={(e) =>
                  setSecretKey(e.target.value)}
                data-testid="secret-key-input"
                aria-label={labels.login.secretKey}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={
                  loading
                  || !accessKey
                  || !secretKey
                }
                data-testid="login-button"
                aria-label={labels.login.submit}
              >
                {labels.login.submit}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
