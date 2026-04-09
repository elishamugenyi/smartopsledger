import { Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/app/components/section-heading";

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="A simple contact page keeps the storefront feeling complete."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <form className="rounded-[32px] border border-border bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="h-12 rounded-2xl border border-border px-4 outline-none" placeholder="Your name" />
            <input className="h-12 rounded-2xl border border-border px-4 outline-none" placeholder="Email" />
            <input className="h-12 rounded-2xl border border-border px-4 outline-none sm:col-span-2" placeholder="Subject" />
            <textarea className="min-h-40 rounded-2xl border border-border px-4 py-3 outline-none sm:col-span-2" placeholder="Message" />
          </div>
          <button className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white">
            Send message
          </button>
        </form>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="font-semibold text-foreground">Nairobi, Kenya</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              12 Riverside Drive, Westlands
            </p>
          </div>
          <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-accent" />
              <p className="font-semibold text-foreground">Phone support</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">+254 700 000 000</p>
          </div>
          <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-secondary" />
              <p className="font-semibold text-foreground">Email support</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              hello@smartstopledger.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
