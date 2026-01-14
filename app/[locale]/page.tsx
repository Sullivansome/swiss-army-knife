import Link from "next/link";

import { getDictionary } from "@/lib/dictionaries";
import { assertLocale } from "@/lib/i18n-config";
import { type ToolCategory, tools } from "@/lib/tools";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const dict = await getDictionary(locale);
  const home = dict.home;
  const cat = dict.categories;

  const categoryOrder: ToolCategory[] = [
    "productivity",
    "design",
    "social",
    "life",
    "数据换算",
    "dev",
    "text",
    "media",
    "security",
    "time",
    "math",
    "wasm",
  ];

  const grouped = categoryOrder
    .map((category) => ({
      category,
      tools: tools.filter((tool) => tool.category === category),
    }))
    .filter((entry) => entry.tools.length > 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <section className="rounded-2xl border bg-card p-8 shadow-sm lg:p-12">
        <div className="flex flex-col gap-6 lg:max-w-3xl">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground lg:text-4xl">
              {home.title}
            </h1>
            <p className="text-lg text-muted-foreground lg:text-xl">
              {home.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/tools`}
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition hover:opacity-90"
            >
              {home.cta}
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {home.categoriesTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {home.categoriesSubtitle}
          </p>
        </div>
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.category} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {cat[group.category]}
                </h3>
                <span className="text-xs font-medium text-muted-foreground">
                  {home.localOnly}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${locale}/tools/${tool.slug}`}
                    className="group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/30"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-foreground">
                          {dict.tools[tool.slug as keyof typeof dict.tools]
                            ?.name ?? tool.slug}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {dict.tools[tool.slug as keyof typeof dict.tools]
                            ?.description ?? ""}
                        </p>
                      </div>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground/80">
                        {cat[tool.category]}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
