import Link from "next/link";
import Image from "next/image";

const SOCIAL_LINKS = [
  { href: "#", src: "/Facebook.webp", alt: "Facebook" },
  { href: "#", src: "/YouTube.webp", alt: "YouTube" },
  { href: "#", src: "/x.webp", alt: "X" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-white/60">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-8 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:gap-12 lg:gap-20 lg:px-12">
        <div className="flex max-w-2xl flex-1 flex-col gap-2 text-left text-black sm:pr-8">
          <p>© {new Date().getFullYear()} SmartOps Ledger. All rights reserved.</p>
          <p>
            SmartOps Ledger is a registered trademark of SmartOps Ledger LLC. Terms
            and conditions, features, support, pricing and service options subject
            to change without notice.
          </p>
          <p>
            By accessing and using this website, you agree to the Terms and
            Conditions and Privacy Policy.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-4 sm:items-end sm:pl-4 lg:pl-8">
          <div className="flex flex-wrap items-center justify-end gap-5 text-black sm:gap-6">
            <Link href="/create-account" className="hover:text-foreground">
              Create account
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Login
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.alt}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.alt}
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <Image
                  src={social.src}
                  alt={social.alt}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
