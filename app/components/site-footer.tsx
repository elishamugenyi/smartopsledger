import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-white/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} SmartOps Ledger. Built for modern operations.</p>
        <div className="flex items-center gap-4">
          <Link href="/create-account" className="hover:text-foreground">
            Create account
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
