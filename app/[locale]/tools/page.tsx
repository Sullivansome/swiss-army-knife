import Link from "next/link";

import { getDictionary } from "@/lib/dictionaries";
import { assertLocale } from "@/lib/i18n-config";
import { tools, type ToolCategory } from "@/lib/tools";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ToolsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale = assertLocale(raw);
  const dict = await getDictionary(locale);
  const home = dict.home;
  const cat = dict.categories;
  const tags = dict.tags;

  const categoryOrder: ToolCategory[] = [
    "productivity",
    "design",
    "social",
    "life",
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
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{home.categoriesTitle}</h1>
        <p className="text-sm text-muted-foreground">{home.categoriesSubtitle}</p>
      </div>
      <div className="space-y-8">
        {grouped.map((group) => (
          <div key={group.category} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-foreground">{cat[group.category]}</h2>
              <span className="text-xs font-medium text-muted-foreground">{home.localOnly}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {group.tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${locale}/tools/${tool.slug}`}
                  className="group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/30"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">
                      {dict.tools[tool.slug as keyof typeof dict.tools]?.name ?? tool.slug}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {dict.tools[tool.slug as keyof typeof dict.tools]?.description ?? ""}
                    </p>
                  </div>
                  <div className="mt-3 inline-flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="rounded-full bg-muted px-3 py-1">{cat[tool.category]}</span>
                    {tool.tags?.map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-2 py-1">
                        {tags[tag as keyof typeof tags] ?? tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
