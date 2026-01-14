import { describe, expect, it } from "vitest";

import { buildFfmpegArgs } from "@/lib/video-to-gif";

describe("video-to-gif helpers", () => {
  it("builds ffmpeg args", () => {
    const args = buildFfmpegArgs({ start: "1", duration: "2", width: "480" });
    expect(args).toEqual([
      "-ss",
      "1",
      "-t",
      "2",
      "-i",
      "input.mp4",
      "-vf",
      "scale=480:-1:flags=lanczos",
      "-f",
      "gif",
      "output.gif",
    ]);
  });
});
