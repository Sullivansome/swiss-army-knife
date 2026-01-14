import { describe, expect, it } from "vitest";

import { buildConvertedFilename, getImageMime } from "@/lib/image-converter";

describe("image converter helpers", () => {
  it("selects mime types", () => {
    expect(getImageMime("jpg")).toBe("image/jpeg");
    expect(getImageMime("png")).toBe("image/png");
    expect(getImageMime("webp")).toBe("image/webp");
  });

  it("builds output filenames", () => {
    expect(buildConvertedFilename("photo.jpeg", "png")).toBe("photo.png");
  });
});
