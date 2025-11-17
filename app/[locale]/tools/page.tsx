import Link from "next/link";

import { getDictionary } from "@/lib/dictionaries";
import { assertLocale } from "@/lib/i18n-config";
import { tools } from "@/lib/tools";

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{home.featured}</h1>
        <p className="text-sm text-muted-foreground">{home.localOnly}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
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
            <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
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
  );
}
