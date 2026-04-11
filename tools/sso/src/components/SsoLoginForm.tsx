'use client';

import React, { useState } from 'react';

/** Props for SsoLoginForm. */
interface SsoLoginFormProps {
  /** Validated redirect target after login. */
  next: string;
}

/**
 * Client-side login form for the SSO portal.
 * POSTs credentials to /api/auth/login which
 * sets the nextra_sso HttpOnly cookie, then
 * redirects the browser to `next`.
 */
export default function SsoLoginForm({
  next,
}: SsoLoginFormProps) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(
        '/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email, password: pw,
          }),
        },
      );
      if (!res.ok) {
        const d = await res.json().catch(
          () => ({}),
        );
        setError(
          (d as { error?: string }).error
          ?? 'Invalid credentials.',
        );
        return;
      }
      window.location.href = next;
    } catch {
      setError('Network error. Please retry.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      <label htmlFor="sso-email">
        Email address
      </label>
      <input
        id="sso-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <label htmlFor="sso-pw">Password</label>
      <input
        id="sso-pw"
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        autoComplete="current-password"
        required
      />
      <button
        type="submit"
        className="btn"
        disabled={busy}
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
