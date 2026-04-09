"use client";

import { useState } from "react";
import { BadgeCheck, Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/app/data/store";
import { useCart } from "@/app/store/cart";
import { Button } from "@/app/components/ui/button";

type ProductPurchasePanelProps = {
  product: Product;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const addItem = useCart((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
      {/* Gradient background matching product accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.accent}`} />
      
      {/* Content */}
      <div className="relative space-y-6 p-8 text-white">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                {product.badge}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              {product.name}
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-white/70">
              {product.category}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-white/70 line-through">
              ${product.compareAtPrice}
            </p>
            <p className="text-5xl font-black">
              ${product.price}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-base leading-relaxed text-white/90">
          {product.details}
        </p>

        {/* Features grid */}
        <div className="grid gap-3 sm:grid-cols-3">
          {product.features.map((feature) => (
            <div 
              key={feature} 
              className="rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-3 text-center"
            >
              <p className="text-sm font-semibold">{feature}</p>
            </div>
          ))}
        </div>

        {/* Quantity selector */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-semibold">Quantity</label>
          <div className="flex items-center rounded-full bg-white/10 backdrop-blur-sm p-1.5">
            {[1, 2, 3, 4].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setQuantity(value)}
                className={`h-11 w-11 rounded-full text-sm font-bold transition-all ${
                  quantity === value
                    ? "bg-white text-zinc-900 shadow-lg"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1 rounded-full bg-zinc-900 px-8 py-6 text-base font-bold text-white hover:bg-black"
            onClick={() => addItem(product, quantity)}
          >
            <ShoppingCart className="h-5 w-5" />
            Add {quantity} to Cart
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full border-2 border-white/30 bg-white/10 px-6 py-6 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <Heart className="h-5 w-5" />
            Save
          </Button>
        </div>

        {/* Reviews section */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">
              Customer confidence
            </span>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
              <BadgeCheck className="h-4 w-4 text-accent" />
              <span className="text-sm font-bold">{product.rating} / 5</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-sm font-medium text-white/80">Total Reviews</span>
            <span className="text-sm font-bold">{product.reviews} reviews</span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            "Free Shipping",
            "2-Year Warranty", 
            "30-Day Returns",
            "Secure Checkout"
          ].map((badge) => (
            <div 
              key={badge}
              className="rounded-xl bg-white/5 backdrop-blur-sm px-3 py-2 text-center"
            >
              <p className="text-xs font-semibold text-white/90">{badge}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
