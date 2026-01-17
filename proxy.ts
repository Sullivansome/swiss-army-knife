import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { serverEnv } from "./lib/env";
import { toolSlugs } from "./lib/generated/tool-registry";
import { defaultLocale, locales } from "./lib/i18n-config";
import { resolveToolSubdomain } from "./lib/subdomain";

export function proxy(request: NextRequest) {
  const toolSlug = resolveToolSubdomain(request.headers.get("host"), {
    baseDomain: serverEnv.BASE_DOMAIN,
    mainSubdomain: serverEnv.MAIN_SUBDOMAIN,
    allowedSlugs: toolSlugs,
  });

  if (toolSlug) {
    const url = request.nextUrl.clone();
    const hasLocalePrefix = locales.some((locale) =>
      url.pathname.startsWith(`/${locale}/`),
    );

    // Preserve query strings while rewriting to the tool path.
    if (!hasLocalePrefix) {
      url.pathname = `/${defaultLocale}/tools/${toolSlug}`;
    } else if (!url.pathname.includes(`/tools/`)) {
      url.pathname = `/tools/${toolSlug}`;
    }

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip internal and asset routes.
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
