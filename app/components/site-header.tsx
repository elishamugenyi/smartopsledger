import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-foreground" aria-label="SmartOps Ledger home">
          SmartOps Ledger
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="rounded-full">
              Log in
            </Button>
          </Link>
          <Link href="/create-account">
            <Button size="sm" className="rounded-full">
              Create account
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
