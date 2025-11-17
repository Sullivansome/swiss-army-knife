type Props = {
  dict: {
    brand: string;
  };
};

export function SiteFooter({ dict }: Props) {
  return (
    <footer className="border-t bg-card/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
        <span>{dict.brand}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
