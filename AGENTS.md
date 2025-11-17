## Development Guidelines for Agents

This App Router project uses locale URL segments (`/en`, `/zh`) and dictionary-based translations (no `next-intl`). Follow these patterns:

1) Routing & locales
- Locale segment is `[locale]`; do not add `i18n` to `next.config.ts`.
- Subdomain rewrites live in `proxy.ts`, driven by `lib/i18n-config.ts` and `lib/tools.ts`.
- Tool routes: `app/[locale]/tools/[slug]/page.tsx`; update `generateStaticParams` when adding tools/locales.

2) Translations
- Add strings to `messages/en.json` and `messages/zh.json`; dictionaries load via `lib/dictionaries.ts`.
- Server components fetch dicts and pass strings as props; no translation hooks.
- When adding a tool: update `lib/tools.ts`, dictionaries (`messages/*` with name/description/category/tags), and surface in `app/[locale]/page.tsx` and `app/[locale]/tools/page.tsx`.

3) Env/config
- Required envs in `.env.example` (`BASE_DOMAIN`, `MAIN_SUBDOMAIN`, `NEXT_PUBLIC_BASE_URL`); validated in `lib/env.ts`.
- Keep header/footer/nav links locale-prefixed; `LocaleSwitcher` swaps the leading segment.

4) UI/components
- `SiteHeader`/`SiteFooter` accept dict slices via props.
- Client tools (e.g., Base64) get labels via props; keep logic browser-only where possible.

5) Tests
- `npm run test:unit` (Vitest) for utilities. Existing: Base64 and subdomain resolution. Add new utility tests near `__tests__/`.

6) When unsure
- Prefer Context7/Next.js docs for App Router behaviors; avoid reintroducing unsupported i18n configs or third-party i18n libs.

7) Safety/build
- Run `npm run lint` before submitting. If Turbopack is problematic in CI, use `TURBOPACK=0`.
