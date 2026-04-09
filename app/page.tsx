import Link from "next/link";
import { ArrowRight, BadgeCheck, Check } from "lucide-react";
import {
  categories,
  heroHighlights,
  products,
  quickServices,
  storeStats,
  testimonials,
} from "@/app/data/store";
import { ProductCard } from "@/app/components/product-card";
import { SectionHeading } from "@/app/components/section-heading";

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-24 pb-20">
      {/* HERO - Premium Product Showcase */}
      <section className="relative overflow-hidden pt-8 pb-16 min-h-[800px] flex items-center">
        {/* Large Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1588508065123-287b28e013da?w=2000&q=80"
            alt="Premium lifestyle background"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/90 via-amber-50/85 to-stone-50/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
          
          {/* Header Text */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-7xl font-bold tracking-tight text-zinc-900 md:text-8xl drop-shadow-sm">
              Smart Stop <span className="text-emerald-600">Ledger</span>
            </h1>
            <p className="text-xl text-zinc-700 max-w-2xl mx-auto font-medium">
              Curated essentials for modern living. Simple. Honest. Beautifully presented.
            </p>
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 font-semibold text-white transition-all hover:bg-black hover:shadow-xl"
              >
                Discover More
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Hero Product Display - Pedestal Style */}
          <div className="relative mx-auto max-w-6xl">
            <div className="relative h-[500px] md:h-[600px]">
              
              {/* Left Product - Sage Green */}
              <div className="absolute left-0 top-12 w-64 md:w-80">
                <div className="relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64 bg-gradient-to-b from-white/80 to-stone-200/80 rounded-t-full backdrop-blur-sm shadow-2xl" 
                       style={{ transform: 'translateX(-50%) perspective(800px) rotateY(-15deg)' }}>
                  </div>
                  <div className="relative z-10 pt-8">
                    <img
                      src="https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400&h=400&fit=crop"
                      alt="Premium Wireless Earbuds - Sage"
                      className="w-full h-auto drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Center Product - Featured */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-80 md:w-96">
                <div className="relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-80 bg-gradient-to-b from-white/80 to-stone-200/80 rounded-t-full backdrop-blur-sm shadow-2xl" />
                  <div className="relative z-10 pt-4">
                    <img
                      src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop"
                      alt="Premium Wireless Earbuds - Black"
                      className="w-full h-auto drop-shadow-2xl"
                    />
                  </div>
                  {/* Interactive View Badge */}
                  <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl px-6 py-3 shadow-xl border border-zinc-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">Interactive view</p>
                        <p className="text-xs text-zinc-500">Open</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Product - Blush */}
              <div className="absolute right-0 top-20 w-64 md:w-80">
                <div className="relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64 bg-gradient-to-b from-white/80 to-stone-200/80 rounded-t-full backdrop-blur-sm shadow-2xl"
                       style={{ transform: 'translateX(-50%) perspective(800px) rotateY(15deg)' }}>
                  </div>
                  <div className="relative z-10 pt-8">
                    <img
                      src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop"
                      alt="Premium Wireless Earbuds - Blush"
                      className="w-full h-auto drop-shadow-2xl"
                    />
                  </div>
                  {/* Price Tag */}
                  <div className="absolute top-12 -right-4 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl border border-zinc-200">
                    <p className="text-2xl font-bold text-zinc-900">$109.99</p>
                    <div className="mt-2 flex items-center justify-center w-8 h-8 bg-zinc-900 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-16 max-w-5xl mx-auto">
            {heroHighlights.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white/80 backdrop-blur p-4 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Check className="h-5 w-5" />
                </div>
                <span className="font-medium text-zinc-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="mx-auto max-w-5xl border-y border-zinc-100 py-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {storeStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-semibold tracking-tighter text-zinc-900">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ELEVATE SECTION */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-widest text-emerald-600 uppercase">
            Why Choose Us?
          </p>
          <h2 className="mt-4 text-5xl font-bold tracking-tight text-zinc-900">
            Elevate your everyday experience.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 - Premium Sound */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 to-amber-950">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop"
              alt="Premium Sound Quality"
              className="h-96 w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h3 className="text-2xl font-semibold tracking-tight">Premium Sound Earbuds</h3>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* Card 2 - Sport */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100 to-rose-200">
            <img
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop"
              alt="Sport Wireless Earbuds"
              className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h3 className="text-2xl font-semibold tracking-tight">Sport Wireless Earbuds</h3>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                Discover More
              </Link>
            </div>
          </div>

          {/* Card 3 - Everyday */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200">
            <img
              src="https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&h=800&fit=crop"
              alt="Everyday Use Earbuds"
              className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h3 className="text-2xl font-semibold tracking-tight">Everyday Use Earbuds</h3>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                Discover More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES - Centered Heading */}
      <section className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Collections"
          title="Shop by department"
          description="Curated categories designed for everyday needs."
          align="center"
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <p className="text-xs uppercase tracking-widest text-white/70">
                  {category.count}
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">
                  {category.name}
                </h3>
                <p className="mt-3 text-white/80">{category.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS - Centered Heading */}
      <section className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Best Sellers"
          title="Featured products"
          description="Items our customers love most right now."
          align="center"
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* WHY US / HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* How it works */}
          <div className="rounded-3xl bg-zinc-900 p-10 text-white">
            <div className="text-emerald-400 text-sm font-medium tracking-widest">
              SIMPLE FLOW
            </div>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight">
              From discovery to delivery — made simple.
            </h2>
            <div className="mt-10 space-y-6">
              {quickServices.map((service) => (
                <div key={service.title} className="flex gap-5">
                  <div className="mt-1 h-6 w-6 flex-shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10"></div>
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why shop here */}
          <div className="space-y-8 rounded-3xl border border-zinc-100 bg-white p-10">
            <SectionHeading
              eyebrow="Why Smart Stop Ledger"
              title="Built for real shopping"
              description="Clean design. Honest experience. No unnecessary complexity."
              align="center"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { title: "Curated selection", text: "Only quality everyday essentials." },
                { title: "Fast & transparent", text: "No hidden fees or confusing flows." },
                { title: "Modern experience", text: "Beautiful interface that feels effortless." },
                { title: "Local focus", text: "Same-day dispatch where available." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-zinc-100 p-6">
                  <p className="font-semibold text-zinc-900">{item.title}</p>
                  <p className="mt-3 text-sm text-zinc-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Centered Heading */}
      <section className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Real voices"
          title="What our customers say"
          description="Don't just take our word for it."
          align="center"
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-zinc-100 bg-white p-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified feedback
              </div>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                {item.quote}
              </p>
              <div className="mt-8">
                <p className="font-semibold text-zinc-900">{item.name}</p>
                <p className="text-sm text-zinc-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}