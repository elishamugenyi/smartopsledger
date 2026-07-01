import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { SiteHeaderNav } from "@/app/components/site-header-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto grid h-16 w-full max-w-[88rem] grid-cols-[auto_1fr_auto] items-center gap-6 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="shrink-0 justify-self-start"
          aria-label="SmartOps Ledger home"
        >
          <Image
            src="/smartops.png"
            alt="SmartOps Ledger"
            width={600}
            height={140}
            priority
            className="h-16 w-auto sm:h-16"
          />
        </Link>

        <SiteHeaderNav />

        <nav className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
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
