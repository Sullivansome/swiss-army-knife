# Developer Guidelines

## Commands (Bun)
- **Dev**: `bun dev` (Starts at http://localhost:3000)
- **Build**: `bun run build`
- **Lint**: `bun run lint`
- **Test**: `bun run test:unit`
- **Gen Registry**: `bun run generate` (Run after adding new tools)

## Architecture
- **Framework**: Next.js 15 (App Router) + Bun + TailwindCSS
- **Structure**:
  - `app/[locale]/tools/[slug]`: Page routes (Server Components)
  - `components/tools/[slug]/index.tsx`: Tool logic (Client Components)
  - `lib/`: Business logic (pure functions) & I18n dictionaries
  - `components/ui/`: Shared UI (Shadcn + Studio/Widget primitives)

## Tool Design System
**MUST** use one of 3 layouts for consistency:

1.  **Studio Layout** (Text/Code/Diff)
    - Components: `<ToolStudio>`, `<StudioPanel>`, `<StudioToolbar>`
    - Pattern: Split-pane input/output with sticky toolbar.
    - Path: `components/ui/studio/`

2.  **Widget Layout** (Calculators/Generators)
    - Components: `<WidgetCard>`, `<WidgetStat>`
    - Pattern: Dashboard style, grouped inputs, visual results.
    - Path: `components/ui/widget-card.tsx`

3.  **Media Layout** (Images/Video/PDF)
    - Components: `<FileDropzone>`, `<WidgetCard>`
    - Pattern: Drag-and-drop zone + Live preview/settings.
    - Path: `components/ui/file-dropzone.tsx`

## Development Rules
1.  **State**: Logic in `lib/`. UI in `components/`. Use `useMemo` for heavy calcs.
2.  **I18n**: No hooks. Receive `labels` prop (dict) from Server Component.
3.  **Icons**: Use `lucide-react`.
4.  **Styling**: Tailwind utility classes. Use `cn()` for merging. Support Dark Mode.
5.  **Registry**: Tools are auto-discovered. Run `bun run generate` to update `lib/generated/`.
