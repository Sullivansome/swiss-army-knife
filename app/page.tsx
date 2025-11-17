import { redirect } from "next/navigation";

import { routing } from "@/i18n/routing";

export default function RootPage() {
  // Redirect root to default locale homepage.
  redirect(`/${routing.defaultLocale}`);
}
