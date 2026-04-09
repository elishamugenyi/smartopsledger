"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/app/data/store";

export type CartItem = Product & {
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.slug === product.slug);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.slug === product.slug
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity }],
          };
        }),
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        })),
      updateQuantity: (slug, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.slug === slug ? { ...item, quantity } : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "smart-stop-ledger-cart",
    },
  ),
);
