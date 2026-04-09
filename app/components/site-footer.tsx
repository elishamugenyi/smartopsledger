import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { categories, navLinks } from "@/app/data/store";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">
              Smart Stop
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight">
              Ledger Storefront
            </h3>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/75">
            A clean ecommerce frontend with a premium feel, quick browsing, and
            a streamlined checkout flow.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-white/60">
            Explore
          </h4>
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-accent"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-white/60">
            Categories
          </h4>
          <div className="grid gap-2">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="text-sm text-white/80 transition-colors hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-white/60">
            Contact
          </h4>
          <div className="grid gap-4 text-sm text-white/80">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-accent" />
              <span>12 Riverside Drive, Nairobi</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-accent" />
              <span>+254 700 000 000</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-accent" />
              <span>hello@smartstopledger.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/60 md:px-6">
        Smart Stop Ledger frontend concept. Built as a polished ecommerce shell.
      </div>
    </footer>
  );
}
