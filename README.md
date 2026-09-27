# MGA Student Arena

Standalone student-facing app. Main website remains in `../mga-academy-site`; admin remains in `../mga-admin-web`. Original migration backups: `../tmp/arena-migration-backup`.

## Local development

From the workspace root: `npm run dev:arena` (port 3004). Main website: port 3001. Admin: port 3002. `npm run build:arena` creates `mga-student-arena/dist`.

When no API is configured, the Login button accepts any non-empty username/password and opens a sample profile, matching the original prototype. Remember me uses localStorage; otherwise the session uses sessionStorage. Passwords are never stored. This is a prototype login, not authentication for real student records. When an API is configured, sign-in uses that API and never falls back to a sample session after failure. Old main-site sessions are not transferred across origins.

## API contract (integration pending)

Set `VITE_ARENA_API_URL` to the HTTPS student API base, ideally a same-origin `/api` proxy.

- `POST /session`: JSON `{ username, password, remember }`; authenticate on the server, set a secure HttpOnly host-only session cookie, return `{ student }`.
- `GET /session`: validate the cookie, return only the authenticated student's `{ student }`; 401 for unauthenticated requests.
- `POST /logout`: invalidate the session and clear the cookie; return 204.
- The student DTO is defined in `src/auth.ts`; admin profile data must be mapped server-side. No admin localStorage is read and no private API keys belong in Vite environment variables.
- Enforce student ownership, active status, CSRF protection, rate limits and session expiration server-side. Cross-origin APIs need explicit allowed origin and credentials support. This client is not a replacement for authorization.

Games, game stats, leaderboard and learning features are Coming soon previews, not live integrations. Anonymous leaderboard rows do not contain real student data. Academic data is sample-only in demo and server-provided for authenticated sessions.

## Deployment

Create a separate hosting target for `arena.<your-domain>`. Build from repository root with `npm run build:arena`; publish `mga-student-arena/dist`. Configure SPA fallback to index.html. Set the public website's `VITE_STUDENT_ARENA_URL` to the full Arena URL at build time. Its old `/student-arena` route redirects there. Configure DNS/TLS in your hosting provider; no deployment or DNS changes have been performed here.

Light/dark preference is stored only in Arena localStorage. Profile fields are read-only. No passwords are stored in browser storage. Existing MGA logo PNGs and login slideshow artwork were reused.
