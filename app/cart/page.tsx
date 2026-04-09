"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/app/store/cart";
import { Button } from "@/app/components/ui/button";
import { SectionHeading } from "@/app/components/section-heading";

export default function CartPage() {
  const items = useCart((state) => state.items);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const clearCart = useCart((state) => state.clearCart);
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
        eyebrow="Cart"
        title="Review your selections"
        description="The cart is fully frontend-driven and persists locally."
      />

      {!mounted || readyItems.length === 0 ? (
        <div className="mt-10 rounded-[32px] border border-border bg-white p-10 text-center shadow-sm">
          <p className="text-2xl font-black text-foreground">Your cart is empty</p>
          <p className="mt-3 text-muted-foreground">
            Start from the products page and add a few items to continue.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            {readyItems.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col gap-4 rounded-[28px] border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-full rounded-2xl object-cover sm:w-32"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.badge}
                      </p>
                    </div>
                    <p className="text-lg font-black text-secondary">
                      ${item.price * item.quantity}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-full border border-border bg-muted/40">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.slug, Math.max(1, item.quantity - 1))
                        }
                        className="p-2"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-10 px-3 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity + 1)
                        }
                        className="p-2"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[32px] border border-border bg-white p-6 shadow-xl shadow-black/5">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Order summary
            </h2>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">${readySubtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold text-foreground">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-semibold text-foreground">Estimated later</span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-muted/50 p-5">
              <p className="text-sm text-muted-foreground">Estimated total</p>
              <p className="mt-1 text-3xl font-black text-secondary">
                ${readySubtotal}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/checkout"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white"
              >
                Proceed to checkout
              </Link>
              <Button variant="outline" onClick={clearCart}>
                Clear cart
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
