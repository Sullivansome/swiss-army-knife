import { describe, expect, it } from "vitest";

import { resolveToolSubdomain } from "@/lib/subdomain";

const options = {
  baseDomain: "abc.com",
  mainSubdomain: "toolcenter",
  allowedSlugs: ["base64", "uuid"],
};

describe("resolveToolSubdomain", () => {
  it("returns slug for valid tool subdomain", () => {
    expect(resolveToolSubdomain("base64.abc.com", options)).toBe("base64");
  });

  it("returns null for main subdomain", () => {
    expect(resolveToolSubdomain("toolcenter.abc.com", options)).toBe(null);
  });

  it("returns null when domain does not match base domain", () => {
    expect(resolveToolSubdomain("base64.example.com", options)).toBe(null);
  });

  it("returns null for disallowed slug", () => {
    expect(resolveToolSubdomain("unknown.abc.com", options)).toBe(null);
  });
});
