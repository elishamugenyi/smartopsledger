import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { SiteHeaderNav, SiteHeaderMobileMenu } from "@/app/components/site-header-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="shrink-0"
          aria-label="SmartOps Ledger home"
        >
          <Image
            src="/smartops.png"
            alt="SmartOps Ledger"
            width={600}
            height={140}
            priority
            className="h-12 w-auto sm:h-16"
          />
        </Link>

        <SiteHeaderNav />

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="rounded-full px-2.5 sm:px-3">
              Log in
            </Button>
          </Link>
          <Link href="/create-account">
            <Button size="sm" className="rounded-full px-2.5 sm:px-3">
              <span className="hidden min-[400px]:inline">Create account</span>
              <span className="min-[400px]:hidden">Sign up</span>
            </Button>
          </Link>
          <SiteHeaderMobileMenu />
        </div>
      </div>
    </header>
  );
}
