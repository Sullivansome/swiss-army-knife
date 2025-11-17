import { getTranslations } from "next-intl/server";

import { Link } from "@/navigation";
import { tools } from "@/lib/tools";

export default async function ToolsPage() {
  const t = await getTranslations();
  const home = await getTranslations("home");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{home("featured")}</h1>
        <p className="text-sm text-muted-foreground">{home("localOnly")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/30"
          >
            <div className="space-y-1">
              <div className="text-sm font-semibold text-foreground">{t(tool.nameKey)}</div>
              <p className="text-sm text-muted-foreground">{t(tool.descriptionKey)}</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">{tool.category}</span>
              {tool.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
