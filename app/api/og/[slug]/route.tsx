// app/api/og/[slug]/route.tsx
import { ImageResponse } from "next/og";
import { getToolLabels } from "@/lib/generated/tool-i18n";

export const runtime = "edge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: Request, { params }: Props) {
  const { slug } = await params;
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") ?? "en";

  const labels = getToolLabels(slug, locale);

  if (!labels) {
    return new Response("Tool not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          padding: 60,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {labels.name as string}
        </h1>
        <p
          style={{
            fontSize: 32,
            opacity: 0.8,
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          {labels.description as string}
        </p>
        <span
          style={{
            fontSize: 24,
            marginTop: 40,
            opacity: 0.6,
          }}
        >
          Tool Center
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
