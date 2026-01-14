export type VideoToGifSettings = {
  start: string;
  duration: string;
  width: string;
};

export function buildFfmpegArgs(settings: VideoToGifSettings) {
  return [
    "-ss",
    settings.start,
    "-t",
    settings.duration,
    "-i",
    "input.mp4",
    "-vf",
    `scale=${settings.width}:-1:flags=lanczos`,
    "-f",
    "gif",
    "output.gif",
  ];
}
