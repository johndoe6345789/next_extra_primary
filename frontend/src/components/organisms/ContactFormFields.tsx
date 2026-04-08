'use client';

import React, {
  type ChangeEvent,
} from 'react';
import TextField from '@shared/m3/TextField';
import s from
  '@shared/scss/modules/ContactForm.module.scss';

/** Shorthand for input change events. */
type InputEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

/** Props for ContactFormFields. */
export interface ContactFormFieldsProps {
  /** Name field value. */
  name: string;
  /** Name field setter. */
  setName: (v: string) => void;
  /** Email field value. */
  email: string;
  /** Email field setter. */
  setEmail: (v: string) => void;
  /** Message field value. */
  message: string;
  /** Message field setter. */
  setMessage: (v: string) => void;
  /** Translated labels. */
  labels: {
    name: string;
    email: string;
    message: string;
  };
}

/**
 * Renders the three contact form input fields:
 * name, email, and message.
 */
const ContactFormFields: React.FC<
  ContactFormFieldsProps
> = ({
  name, setName, email, setEmail,
  message, setMessage, labels,
}) => (
  <>
    <div className={s.field}>
      <TextField
        label={labels.name}
        name="name"
        value={name}
        onChange={(e: InputEvent) =>
          setName(e.target.value)}
        required
        fullWidth
        autoComplete="name"
      />
    </div>
    <div className={s.field}>
      <TextField
        label={labels.email}
        name="email"
        type="email"
        value={email}
        onChange={(e: InputEvent) =>
          setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
      />
    </div>
    <div className={s.field}>
      <TextField
        label={labels.message}
        name="message"
        value={message}
        onChange={(e: InputEvent) =>
          setMessage(e.target.value)}
        required
        fullWidth
        multiline
        rows={5}
      />
    </div>
  </>
);

export default ContactFormFields;
