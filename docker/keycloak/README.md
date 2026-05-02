# Keycloak

Realm: `nextra` (client `nextra-app`, public + PKCE).
Admin console: <http://localhost:8088/sso/admin/>
Public base:   <http://localhost:8889/sso/>

## Email (password reset)

The realm's `smtpServer` block points at the in-stack `mailserver`
service (`mailserver:587`, no auth, STARTTLS off — dev only).
Reset-password emails land in the dev mailspool and are visible
through the webmail UI at `/emailclient`.

## OAuth identity providers

Three IdPs are pre-declared in `realm-export.json`, all `enabled:
false`:

| Alias       | Provider  | Default scope             |
|-------------|-----------|---------------------------|
| `github`    | github    | (provider default)        |
| `google`    | google    | `openid email profile`    |
| `microsoft` | microsoft | `openid email profile`    |

Their `clientId` / `clientSecret` are wired to env-var
indirection (`${env.KC_<NAME>_CLIENT_ID:}`). The compose file
forwards these six variables to the keycloak container:

```
KC_GITHUB_CLIENT_ID       KC_GITHUB_CLIENT_SECRET
KC_GOOGLE_CLIENT_ID       KC_GOOGLE_CLIENT_SECRET
KC_MICROSOFT_CLIENT_ID    KC_MICROSOFT_CLIENT_SECRET
```

### Enabling a provider

1. Register an OAuth app at the provider:
   - GitHub:    Settings -> Developer settings -> OAuth Apps
   - Google:    Google Cloud Console -> APIs & Services -> Credentials
   - Microsoft: Azure Portal -> Microsoft Entra ID -> App registrations
2. Set the redirect / callback URI to:
   `http://localhost:8889/sso/realms/nextra/broker/<alias>/endpoint`
   where `<alias>` is `github`, `google`, or `microsoft`.
3. Put the client ID + secret into your host env or `.env` file:
   ```
   KC_GITHUB_CLIENT_ID=...
   KC_GITHUB_CLIENT_SECRET=...
   ```
4. Flip the IdP to `enabled: true`. Two ways:
   - Edit `realm-export.json`, rebuild keycloak, re-import.
   - Or toggle it live in the admin console under
     `Identity providers -> <alias>`.
5. Rebuild the container:
   ```
   docker compose build keycloak
   docker compose up -d --no-deps --force-recreate keycloak
   ```

Unset env vars expand to empty strings, so leaving an IdP
disabled with blank credentials is safe.
