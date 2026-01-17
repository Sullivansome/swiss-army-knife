export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 animate-pulse">
      {/* Hero section skeleton */}
      <section className="rounded-2xl border bg-card p-8 shadow-sm lg:p-12">
        <div className="flex flex-col gap-6 lg:max-w-3xl">
          <div className="space-y-3">
            <div className="h-10 w-64 rounded bg-muted" />
            <div className="h-6 w-96 rounded bg-muted" />
          </div>
          <div className="h-10 w-32 rounded-lg bg-muted" />
        </div>
      </section>

      {/* Categories section skeleton */}
      <section className="space-y-6">
        <div>
          <div className="h-7 w-48 rounded bg-muted" />
          <div className="mt-2 h-4 w-64 rounded bg-muted" />
        </div>
        <div className="space-y-8">
          {[1, 2, 3].map((group) => (
            <div key={group} className="space-y-3">
              <div className="h-6 w-32 rounded bg-muted" />
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
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
