'use client';

import React from 'react';
import Alert from '@shared/m3/Alert';
import { useTranslations } from 'next-intl';
import Button from '@shared/m3/Button';
import { useContactForm } from
  '@/hooks/useContactForm';
import ContactFormFields from
  './ContactFormFields';
import s from
  '@shared/scss/modules/ContactForm.module.scss';

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
        <ContactFormFields
          name={name} setName={setName}
          email={email} setEmail={setEmail}
          message={message}
          setMessage={setMessage}
          labels={{
            name: t('name'),
            email: t('email'),
            message: t('message'),
          }}
        />
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
          data-testid="contact-submit"
        >
          {isLoading
            ? t('sending') : t('send')}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
