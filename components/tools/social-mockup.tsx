"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

export type SocialMockupLabels = {
  platform: string;
  name: string;
  handle: string;
  content: string;
  time: string;
  download: string;
  helper: string;
  twitter: string;
  instagram: string;
};

type Platform = "twitter" | "instagram";

type Props = {
  labels: SocialMockupLabels;
};

export function SocialMockupTool({ labels }: Props) {
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [name, setName] = useState("Jane Doe");
  const [handle, setHandle] = useState("@janedoe");
  const [content, setContent] = useState("Hello world! This is a quick mockup.");
  const [time, setTime] = useState("2h");
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  const download = async () => {
    if (!previewRef.current) return;
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(previewRef.current, { backgroundColor: '#0f1419' });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${platform}-mockup.png`;
      link.click();
    } catch (error) {
      console.error("mockup", error);
    } finally {
      setLoading(false);
    }
  };

  const isTwitter = platform === "twitter";
  const avatarClass = isTwitter ? "bg-white/20" : "bg-black/10";
  const containerClass = isTwitter ? "bg-[#0f1419] text-white" : "bg-white text-black";
  const subTextClass = isTwitter ? "text-white/60" : "text-black/60";

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{labels.helper}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{labels.platform}</label>
            <select
              value={platform}
              onChange={(event) => setPlatform(event.target.value as Platform)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            >
              <option value="twitter">{labels.twitter}</option>
              <option value="instagram">{labels.instagram}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{labels.name}</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{labels.handle}</label>
            <input
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{labels.time}</label>
            <input
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">{labels.content}</label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-32 w-full rounded-lg border bg-background p-3 text-sm shadow-inner"
            />
          </div>

          <Button size="sm" onClick={download} disabled={loading}>
            {labels.download}
          </Button>
        </div>

        <div className="rounded-2xl border bg-background p-4">
          <div ref={previewRef} className={`rounded-xl p-5 shadow-lg ${containerClass}`}>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full ${avatarClass}`} />
              <div>
                <p className="font-semibold">{name}</p>
                <p className={`text-sm ${subTextClass}`}>{handle}</p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-base">{content}</p>
            <p className={`mt-3 text-sm ${subTextClass}`}>{time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
