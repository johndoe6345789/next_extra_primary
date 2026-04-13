'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import TextField from '@shared/m3/TextField';
import { Autocomplete } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useTestEmail }
  from '@/hooks/useTestEmail';
import EmailResultAlert
  from './EmailResultAlert';

/** @returns Admin test-email form. */
const AdminTestEmail: React.FC = () => {
  const t = useTranslations('admin');
  const {
    to, setTo, subject, setSubject,
    body, setBody, valid, isLoading,
    result, handleSend, emailOptions,
  } = useTestEmail();

  return (
    <Box
      data-testid="admin-test-email"
      sx={{ maxWidth: 520 }}
    >
      <Autocomplete<string>
        options={emailOptions}
        inputValue={to}
        onInputChange={(_, v) => setTo(v)}
        onChange={(_, v) => {
          if (typeof v === 'string') setTo(v);
        }}
        freeSolo
        placeholder={t('emailTo')}
        testId="email-to"
        style={{ marginBottom: 16 }}
      />
      <TextField
        label={t('emailSubject')}
        value={subject}
        onChange={(e) =>
          setSubject(e.target.value)}
        fullWidth size="small" sx={{ mb: 2 }}
        data-testid="email-subject"
        aria-label={t('emailSubject')}
      />
      <TextField
        label={t('emailBody')}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        fullWidth multiline rows={4}
        size="small" sx={{ mb: 2 }}
        data-testid="email-body"
        aria-label={t('emailBody')}
      />
      <Button
        variant="contained"
        onClick={handleSend}
        disabled={!valid || isLoading}
        data-testid="email-send"
        aria-label={t('sendTest')}
      >
        {isLoading
          ? t('sending')
          : t('sendTest')}
      </Button>
      <EmailResultAlert result={result} />
    </Box>
  );
};

export default AdminTestEmail;
