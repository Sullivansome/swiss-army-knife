import { clientEnv } from "@/lib/env";

export default function robots() {
  const sitemap = `${clientEnv.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap,
  };
}
