'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';
import { useContactForm } from '@/hooks/useContactForm';

/** Props for the ContactForm organism. */
export interface ContactFormProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Contact form with name, email, message fields.
 *
 * @param props - Component props.
 */
export const ContactForm: React.FC<ContactFormProps> = ({
  testId = 'contact-form',
}) => {
  const t = useTranslations('contact');
  const {
    name, setName,
    email, setEmail,
    message, setMessage,
    isLoading, success, submit,
  } = useContactForm();

  return (
    <Box
      component="form"
      role="form"
      aria-label={t('title')}
      onSubmit={submit}
      data-testid={testId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {success && (
        <Alert severity="success" data-testid="contact-success">
          {t('sent')}
        </Alert>
      )}
      <TextField
        label={t('name')}
        name="name"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)}
        required
        fullWidth
        autoComplete="name"
      />
      <TextField
        label={t('email')}
        name="email"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
      />
      <TextField
        label={t('message')}
        name="message"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
        required
        fullWidth
        multiline
        rows={5}
      />
      <Button
        type="submit"
        fullWidth
        disabled={isLoading}
        testId="contact-submit"
      >
        {isLoading ? t('sending') : t('send')}
      </Button>
    </Box>
  );
};

export default ContactForm;
