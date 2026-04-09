import Link from "next/link";
import { SectionHeading } from "@/app/components/section-heading";

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <SectionHeading
        eyebrow="Account"
        title="Customer area"
        description="A placeholder account dashboard helps complete the route structure."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[32px] border border-border bg-white p-6 shadow-sm">
          <div className="h-24 w-24 rounded-full bg-primary/10" />
          <h2 className="mt-4 text-2xl font-black text-foreground">Guest user</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign-in integration can be added later without changing the layout.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 font-semibold text-white"
          >
            Go to login
          </Link>
        </div>
        <div className="rounded-[32px] border border-border bg-secondary p-6 text-white shadow-2xl shadow-secondary/10">
          <h2 className="text-2xl font-black">Recent orders</h2>
          <div className="mt-5 grid gap-3">
            {[
              "Aurora Wireless Headphones",
              "Market Basket Pantry Box",
              "Focus Desk Organizer",
            ].map((order) => (
              <div
                key={order}
                className="rounded-3xl border border-white/10 bg-white/8 px-5 py-4"
              >
                {order}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
