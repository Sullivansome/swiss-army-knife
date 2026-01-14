export type SocialPlatform = "twitter" | "instagram";

export function getMockupTheme(platform: SocialPlatform) {
  const isTwitter = platform === "twitter";
  return {
    avatarClass: isTwitter ? "bg-white/20" : "bg-black/10",
    containerClass: isTwitter
      ? "bg-[#0f1419] text-white"
      : "bg-white text-black",
    subTextClass: isTwitter ? "text-white/60" : "text-black/60",
    backgroundColor: isTwitter ? "#0f1419" : "#ffffff",
  };
}

export function getMockupFilename(platform: SocialPlatform) {
  return `${platform}-mockup.png`;
}
