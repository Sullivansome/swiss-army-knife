// lib/tool-types.ts
import type { ComponentType } from "react";

export type ToolCategory =
  | "dev"
  | "text"
  | "security"
  | "media"
  | "time"
  | "math"
  | "productivity"
  | "design"
  | "social"
  | "life"
  | "wasm"
  | "conversion";

export type ToolSeoConfig = {
  keywords?: string[];
};

export type ToolMeta = {
  slug: string;
  category: ToolCategory;
  tags?: string[];
  icon?: string;
  seo?: ToolSeoConfig;
};

export type ToolLabels = {
  name: string;
  description: string;
  [key: string]: unknown;
};

export type ToolComponent = ComponentType<{ labels: ToolLabels }>;

export type ToolModule = {
  default: ToolComponent;
};

export type ToolLoader = () => Promise<ToolModule>;
