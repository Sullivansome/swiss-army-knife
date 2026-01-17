export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-72 rounded bg-muted" />
      </div>

      {/* Tools grid skeleton */}
      <div className="space-y-8">
        {[1, 2, 3].map((group) => (
          <div key={group} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="h-6 w-32 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border bg-card p-5 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="h-5 w-40 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-muted" />
                    <div className="h-6 w-12 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
