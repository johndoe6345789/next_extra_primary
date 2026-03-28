'use client';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useLoginForm } from '@/hooks';
import labels from '@/constants/ui-labels.json';

/**
 * @brief Login form with credential fields.
 */
export default function LoginForm() {
  const form = useLoginForm();

  return (
    <form
      onSubmit={form.handleSubmit}
      data-testid="login-form"
    >
      <Stack spacing={2}>
        {form.error && (
          <Alert severity="error">
            {form.error}
          </Alert>
        )}
        <TextField
          fullWidth
          label={labels.login.accessKey}
          value={form.accessKey}
          onChange={(e) =>
            form.setAccessKey(e.target.value)}
          data-testid="access-key-input"
          aria-label={labels.login.accessKey}
        />
        <TextField
          fullWidth
          type="password"
          label={labels.login.secretKey}
          value={form.secretKey}
          onChange={(e) =>
            form.setSecretKey(e.target.value)}
          data-testid="secret-key-input"
          aria-label={labels.login.secretKey}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={
            form.loading
            || !form.accessKey
            || !form.secretKey
          }
          data-testid="login-button"
          aria-label={labels.login.submit}
        >
          {labels.login.submit}
        </Button>
      </Stack>
    </form>
  );
}
