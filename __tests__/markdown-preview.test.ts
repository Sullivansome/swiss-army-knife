import { describe, expect, it } from "vitest";

import {
  DEFAULT_MARKDOWN,
  MARKDOWN_REHYPE_PLUGINS,
  MARKDOWN_REMARK_PLUGINS,
} from "@/lib/markdown";

describe("markdown preview config", () => {
  it("defines a sensible default markdown snippet", () => {
    expect(DEFAULT_MARKDOWN).toContain("# Markdown");
    expect(DEFAULT_MARKDOWN).toContain("- Preview on the right");
  });

  it("wires remark/rehype plugins", () => {
    expect(MARKDOWN_REMARK_PLUGINS.length).toBeGreaterThan(0);
    expect(MARKDOWN_REHYPE_PLUGINS.length).toBeGreaterThan(0);
    expect(typeof MARKDOWN_REMARK_PLUGINS[0]).toBe("function");
    expect(typeof MARKDOWN_REHYPE_PLUGINS[0]).toBe("function");
  });
});
