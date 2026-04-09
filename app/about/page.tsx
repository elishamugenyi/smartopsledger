import { SectionHeading } from "@/app/components/section-heading";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <SectionHeading
        eyebrow="About"
        title="Built as a modern normal ecommerce storefront"
        description="Smart Stop Ledger borrows the richness of a polished brand site, but its content stays focused on everyday retail."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[32px] border border-border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">Our approach</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            The design prioritizes clear visual hierarchy, consistent card
            systems, and fast route-based browsing. It feels like a commercial
            storefront without requiring an external backend for the frontend
            demo.
          </p>
        </div>
        <div className="rounded-[32px] border border-border bg-secondary p-6 text-white shadow-2xl shadow-secondary/10">
          <h2 className="text-2xl font-black tracking-tight">Design goals</h2>
          <ul className="mt-4 grid gap-3 text-white/80">
            <li>• Strong homepage presence</li>
            <li>• Real product catalogue pages</li>
            <li>• Cart and checkout flow</li>
            <li>• Calm, premium colour palette</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
