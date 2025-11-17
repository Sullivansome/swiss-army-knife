import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { serverEnv } from "./lib/env";
import { resolveToolSubdomain } from "./lib/subdomain";
import { toolSlugs } from "./lib/tools";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const toolSlug = resolveToolSubdomain(request.headers.get("host"), {
    baseDomain: serverEnv.BASE_DOMAIN,
    mainSubdomain: serverEnv.MAIN_SUBDOMAIN,
    allowedSlugs: toolSlugs,
  });

  if (toolSlug) {
    const url = request.nextUrl.clone();
    const hasLocalePrefix = routing.locales.some((locale) =>
      url.pathname.startsWith(`/${locale}/`),
    );

    // Preserve query strings while rewriting to the tool path.
    if (!hasLocalePrefix) {
      url.pathname = `/${routing.defaultLocale}/tools/${toolSlug}`;
    } else if (!url.pathname.includes(`/tools/`)) {
      url.pathname = `/tools/${toolSlug}`;
    }

    return NextResponse.rewrite(url);
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip internal and asset routes.
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
