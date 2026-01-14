export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">404</h1>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find that page. Please check the URL or pick a tool
          from the list.
        </p>
      </div>
    </div>
  );
}
