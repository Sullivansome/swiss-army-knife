export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 animate-pulse">
      {/* Tool header skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="h-5 w-96 rounded bg-muted" />
      </div>

      {/* Tool content skeleton */}
      <div className="space-y-6">
        {/* Toolbar skeleton */}
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <div className="h-8 w-20 rounded bg-muted" />
          <div className="h-8 w-20 rounded bg-muted" />
          <div className="flex-1" />
          <div className="h-8 w-16 rounded bg-muted" />
        </div>

        {/* Main content area skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-3 h-5 w-24 rounded bg-muted" />
            <div className="h-[300px] rounded-lg bg-muted" />
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-3 h-5 w-24 rounded bg-muted" />
            <div className="h-[300px] rounded-lg bg-muted" />
          </div>
        </div>

        {/* Action button skeleton */}
        <div className="flex justify-center">
          <div className="h-10 w-32 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
