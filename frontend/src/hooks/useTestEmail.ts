'use client';

import { useState } from 'react';
import {
  useSendTestEmailMutation,
  useListAdminUsersQuery,
} from '@/store/api/adminApi';

/** Return type for useTestEmail. */
export interface UseTestEmailReturn {
  /** Recipient address. */
  to: string;
  /** Set recipient. */
  setTo: (v: string) => void;
  /** Subject line. */
  subject: string;
  /** Set subject. */
  setSubject: (v: string) => void;
  /** Email body. */
  body: string;
  /** Set body. */
  setBody: (v: string) => void;
  /** Whether the form passes validation. */
  valid: boolean;
  /** Whether a send is in flight. */
  isLoading: boolean;
  /** Result of the last send attempt. */
  result: 'ok' | 'err' | null;
  /** Submit handler. */
  handleSend: () => Promise<void>;
  /** Known user emails for autocomplete. */
  emailOptions: string[];
}

/**
 * Encapsulates state and send logic for the
 * admin test-email form.
 *
 * @returns Test email form state and handlers.
 */
export function useTestEmail(): UseTestEmailReturn {
  const [send, { isLoading }] =
    useSendTestEmailMutation();
  const { data: usersData } =
    useListAdminUsersQuery({ page: 1, perPage: 50 });
  const emailOptions = (usersData?.data ?? [])
    .map((u) => u.email);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] =
    useState<'ok' | 'err' | null>(null);

  const valid =
    to.includes('@') && subject.length > 0;

  const handleSend = async () => {
    setResult(null);
    try {
      await send({
        to, subject, body,
      }).unwrap();
      setResult('ok');
    } catch {
      setResult('err');
    }
  };

  return {
    to, setTo, subject, setSubject,
    body, setBody, valid, isLoading,
    result, handleSend, emailOptions,
  };
}
