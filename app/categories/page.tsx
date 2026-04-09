import Link from "next/link";
import { categories } from "@/app/data/store";
import { SectionHeading } from "@/app/components/section-heading";

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <SectionHeading
        eyebrow="Categories"
        title="Find the right shelf faster"
        description="A full category page makes the storefront feel more complete and easier to navigate."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="group overflow-hidden rounded-[32px] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <img
              src={category.image}
              alt={category.name}
              className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  {category.name}
                </h2>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                  {category.count}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {category.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
