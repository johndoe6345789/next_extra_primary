import SsoLoginForm from '@/components/SsoLoginForm';
import { safeNext } from '@/lib/safeNext';

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

/**
 * SSO login page. Reads the `next` query param
 * and passes it (sanitised) to the login form.
 *
 * @param props - Page props with searchParams.
 */
export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { next: raw } = await searchParams;
  const next = safeNext(raw);
  const qs = next !== '/' ? `?next=${encodeURIComponent(next)}` : '';

  return (
    <div className="card">
      <p className="logo">NextExtra</p>
      <p className="subtitle">
        Sign in to continue
        {next !== '/' && (
          <> to <strong>{next}</strong></>
        )}
      </p>
      <SsoLoginForm next={next} />
      <div className="sso-links">
        <a
          href={`/sso/forgot-password${qs}`}
          className="link"
        >
          Forgot password?
        </a>
        <a
          href={`/sso/register${qs}`}
          className="link"
        >
          Create account
        </a>
      </div>
    </div>
  );
}
