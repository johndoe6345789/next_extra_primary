import SsoLoginForm from '@/components/SsoLoginForm';

/** Allowed redirect origins (same-host only). */
const SAFE_PATHS = /^\/[a-zA-Z0-9/_?=&%-]*$/;

/** Validate and sanitise the next param. */
function safeNext(raw: string | undefined): string {
  if (raw && SAFE_PATHS.test(raw)) return raw;
  return '/';
}

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
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
    </div>
  );
}
