"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/app/data/store";
import { useCart } from "@/app/store/cart";
import { Button } from "@/app/components/ui/button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  return (
    <article className="group relative overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Gradient background with dark hue overlay to reduce vibrancy */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.accent}`} />
      
      {/* Dark overlay for calmer, less vibrant look */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content container */}
      <div className="relative flex h-full min-h-[500px] flex-col p-8">
        
        {/* Category label */}
        <p className="text-xs font-medium uppercase tracking-widest text-white/75">
          {product.category}
        </p>

        {/* Product name */}
        <h3 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white">
          {product.name}
        </h3>

        {/* Product image - clickable */}
        <div className="relative my-10 flex flex-1 items-center justify-center">
          <Link 
            href={`/products/${product.slug || product.id}`}
            className="block transition-transform duration-300 group-hover:scale-[1.01]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-64 w-full object-contain"
            />
          </Link>
        </div>

        {/* Bottom section */}
        <div className="mt-auto space-y-6">
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <p className="text-4xl font-black tracking-tighter text-white">
              ${product.price}
            </p>

            <Button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="rounded-full bg-white/90 px-8 py-6 font-semibold text-zinc-900 
                         transition-all duration-200 hover:bg-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </Button>
          </div>

          {/* View Details Link */}
          <Link
            href={`/products/${product.slug || product.id}`}
            className="group/link inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white/95"
          >
            View details
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
