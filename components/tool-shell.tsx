type ToolShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function ToolShell({ title, description, children }: ToolShellProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">{children}</div>
    </div>
  );
}
