import Link from "next/link";
import { products } from "@/app/data/store";
import { SectionHeading } from "@/app/components/section-heading";

export default function DealsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <SectionHeading
        eyebrow="Deals"
        title="Highlighted offers"
        description="A dedicated deals route gives the store a more complete ecommerce shape."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.slice(0, 6).map((product) => (
          <div
            key={product.id}
            className="rounded-[32px] border border-border bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Save ${product.compareAtPrice - product.price}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground">
              {product.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <p className="text-3xl font-black text-secondary">${product.price}</p>
              <p className="text-sm text-muted-foreground line-through">
                ${product.compareAtPrice}
              </p>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 font-semibold text-white"
            >
              View deal
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
