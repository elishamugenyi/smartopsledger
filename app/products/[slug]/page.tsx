import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, ShieldCheck, Truck } from "lucide-react";
import { products } from "@/app/data/store";
import { ProductCard } from "@/app/components/product-card";
import { ProductPurchasePanel } from "@/app/components/product-purchase-panel";
import { SectionHeading } from "@/app/components/section-heading";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.slug !== slug)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[36px] border border-border bg-white shadow-xl shadow-black/5">
          <img
            src={product.image}
            alt={product.name}
            className="h-[620px] w-full object-cover"
          />
        </div>

        <ProductPurchasePanel product={product} />
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-border bg-white p-6 shadow-sm">
          <SectionHeading
            eyebrow="What you get"
            title="Product overview"
            description={product.description}
          />
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-muted/50 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="font-semibold text-foreground">Trusted quality</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Designed to feel premium and dependable from the first click.
              </p>
            </div>
            <div className="rounded-3xl bg-muted/50 p-5">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-accent" />
                <p className="font-semibold text-foreground">Fast shipping</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Delivery messaging stays clear and visible through the flow.
              </p>
            </div>
            <div className="rounded-3xl bg-muted/50 p-5">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-secondary" />
                <p className="font-semibold text-foreground">Easy returns</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Confidence-building details help the storefront feel complete.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-secondary p-6 text-white shadow-2xl shadow-secondary/10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
            Product details
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">
            {product.name}
          </h2>
          <p className="mt-4 text-white/80">{product.details}</p>
          <div className="mt-8 grid gap-3">
            {product.features.map((feature) => (
              <div
                key={feature}
                className="rounded-3xl border border-white/10 bg-white/8 px-5 py-4"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-14">
          <SectionHeading
            eyebrow="Related products"
            title="More in this category"
            description="Keep shoppers moving with a few similar items."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
