import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export const DEFAULT_MARKDOWN =
  "# Markdown\n\n- Write on the left\n- Preview on the right";

export const MARKDOWN_REMARK_PLUGINS = [remarkGfm] as const;
export const MARKDOWN_REHYPE_PLUGINS = [rehypeHighlight] as const;
