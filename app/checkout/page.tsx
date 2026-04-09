"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Banknote } from "lucide-react";
import { useCart } from "@/app/store/cart";
import { SectionHeading } from "@/app/components/section-heading";

function CardLogo() {
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true" className="h-6 w-10" fill="none">
      <circle cx="18" cy="16" r="10" fill="#EB001B" fillOpacity="0.95" />
      <circle cx="30" cy="16" r="10" fill="#F79E1B" fillOpacity="0.95" />
      <path
        d="M24 8.2a10 10 0 0 1 0 15.6 10 10 0 0 1 0-15.6Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function MobileMoneyLogo() {
  return (
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <img
            src="https://group.mtn.com/wp-content/uploads/2019/09/logo.png?fit=300%2C300&resize=300%2C300"
            alt="MTN logo"
            className="h-full w-full object-contain p-1"
          />
        </div>
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <img
            src="/airtel-money.jpg"
            alt="Airtel Money"
            className="h-full w-full object-contain p-1"
          />
        </div>
      </div>
    );
  }

function CashLogo() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
      <Banknote className="h-5 w-5" />
    </div>
  );
}

export default function CheckoutPage() {
  const items = useCart((state) => state.items);
  const subtotal = useCart((state) => state.subtotal());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const readyItems = mounted ? items : [];
  const readySubtotal = mounted ? subtotal : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <SectionHeading
        eyebrow="Checkout"
        title="Finish your order"
        description="This is a frontend checkout form meant to complete the full ecommerce journey visually."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <form className="rounded-[32px] border border-border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Shipping details
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input className="h-12 rounded-2xl border border-border px-4 outline-none" placeholder="First name" />
            <input className="h-12 rounded-2xl border border-border px-4 outline-none" placeholder="Last name" />
            <input className="h-12 rounded-2xl border border-border px-4 outline-none sm:col-span-2" placeholder="Email address" />
            <input className="h-12 rounded-2xl border border-border px-4 outline-none sm:col-span-2" placeholder="Delivery address" />
            <input className="h-12 rounded-2xl border border-border px-4 outline-none" placeholder="City" />
            <input className="h-12 rounded-2xl border border-border px-4 outline-none" placeholder="Postal code" />
          </div>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Payment method
            </p>
            <div className="mt-3 grid gap-3">
              {[
                {
                  id: "card",
                  label: "Card",
                  description: "Visa, Mastercard and bank cards",
                  icon: <CardLogo />,
                },
                {
                  id: "mobile-money",
                  label: "Mobile money",
                  description: "MTN Mobile Money and Airtel Money",
                  icon: <MobileMoneyLogo />,
                },
                {
                  id: "cash",
                  label: "Cash",
                  description: "Pay on delivery or in-store",
                  icon: <CashLogo />,
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-white px-4 py-4 transition-colors hover:bg-muted/40"
                >
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked={method.id === "card"}
                    className="h-4 w-4 border-border text-primary"
                  />
                  {method.icon}
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{method.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white">
            Place order
          </button>
        </form>

        <aside className="rounded-[32px] border border-border bg-secondary p-6 text-white shadow-2xl shadow-secondary/10">
          <h2 className="text-2xl font-black tracking-tight">Order summary</h2>
          <div className="mt-6 grid gap-4">
            {readyItems.map((item) => (
              <div
                key={item.slug}
                className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/8 px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-white/70">Qty {item.quantity}</p>
                </div>
                <p className="font-bold">${item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-white p-5 text-foreground">
            <p className="text-sm text-muted-foreground">Estimated total</p>
            <p className="mt-1 text-4xl font-black text-secondary">${readySubtotal}</p>
          </div>

          <Link
            href="/products"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 font-semibold text-white"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
