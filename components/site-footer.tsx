import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("layout");

  return (
    <footer className="border-t bg-card/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
        <span>{t("brand")}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
