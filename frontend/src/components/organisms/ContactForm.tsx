'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import TextField from '@shared/m3/TextField';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';
import { useContactForm } from
  '@/hooks/useContactForm';
import s from './ContactForm.module.scss';

/** Props for the ContactForm organism. */
export interface ContactFormProps {
  /** data-testid attribute. */
  testId?: string;
}

/** Contact form with name, email, message. */
export const ContactForm: React.FC<
  ContactFormProps
> = ({ testId = 'contact-form' }) => {
  const t = useTranslations('contact');
  const {
    name, setName,
    email, setEmail,
    message, setMessage,
    isLoading, success, submit,
  } = useContactForm();

  return (
    <div className={s.root}>
      <h1>{t('title')}</h1>
      <form
        role="form"
        aria-label={t('title')}
        onSubmit={submit}
        data-testid={testId}
      >
        {success && (
          <Alert
            severity="success"
            data-testid="contact-success"
          >
            {t('sent')}
          </Alert>
        )}
        <div className={s.field}>
          <TextField
            label={t('name')}
            name="name"
            value={name}
            onChange={(e) => setName(
              e.target.value,
            )}
            required
            fullWidth
            autoComplete="name"
          />
        </div>
        <div className={s.field}>
          <TextField
            label={t('email')}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(
              e.target.value,
            )}
            required
            fullWidth
            autoComplete="email"
          />
        </div>
        <div className={s.field}>
          <TextField
            label={t('message')}
            name="message"
            value={message}
            onChange={(e) => setMessage(
              e.target.value,
            )}
            required
            fullWidth
            multiline
            rows={5}
          />
        </div>
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
          testId="contact-submit"
        >
          {isLoading ? t('sending') : t('send')}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
