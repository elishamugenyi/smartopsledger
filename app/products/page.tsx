import Link from "next/link";
import { categories, products } from "@/app/data/store";
import { ProductCard } from "@/app/components/product-card";
import { SectionHeading } from "@/app/components/section-heading";

type ProductsPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = (await searchParams) ?? {};
  const activeCategory = params.category;

  const filteredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <SectionHeading
        eyebrow="Catalogue"
        title="Browse the Smart Stop Ledger collection"
        description="Filters are handled with simple frontend routes and query parameters."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            !activeCategory
              ? "bg-primary text-white"
              : "border border-border bg-white text-foreground"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              activeCategory === category.slug
                ? "bg-primary text-white"
                : "border border-border bg-white text-foreground"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
