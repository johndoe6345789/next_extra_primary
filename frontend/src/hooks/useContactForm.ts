'use client';

import { useState } from 'react';
import { useSubmitContactMutation }
  from '@/store/api/contactApi';

/** Return type for the useContactForm hook. */
export interface UseContactFormReturn {
  /** Current name value. */
  name: string;
  /** Name setter. */
  setName: (v: string) => void;
  /** Current email value. */
  email: string;
  /** Email setter. */
  setEmail: (v: string) => void;
  /** Current message value. */
  message: string;
  /** Message setter. */
  setMessage: (v: string) => void;
  /** Whether submission is in flight. */
  isLoading: boolean;
  /** Whether form was submitted successfully. */
  success: boolean;
  /** Form submit handler. */
  submit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Encapsulates state and logic for the contact form.
 *
 * @returns Contact form state and handlers.
 */
export function useContactForm(): UseContactFormReturn {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitContact, { isLoading }] =
    useSubmitContactMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await submitContact({
        name, email, message,
      }).unwrap();
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      /* API error handled by RTK Query */
    }
  };

  return {
    name, setName,
    email, setEmail,
    message, setMessage,
    isLoading, success, submit,
  };
}
