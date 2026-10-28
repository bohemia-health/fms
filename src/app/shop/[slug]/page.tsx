import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SetBreadcrumb, SetFootnotes } from "@asclepius/ui";
import { lineFor, storeLines, toStoreProducts } from "@/components/store/lines";
import { storeColumn, type StoreVariant } from "@/components/store/types";
import ProductRail from "@/components/store/ProductRail";
import ProductBuyBox from "./ProductBuyBox";
import LinePage from "./LinePage";
import { SITE_URL } from "@/app/sitemap";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Open Graph wants absolute image URLs; the line cut-outs are in /public.
const og = (path: string) => `${SITE_URL}${path}`;

// Tab title: the line's name for a line page, the product's for a product.
// An unknown slug 404s from here: metadata resolves before the response
// starts streaming, so the status is a real 404; a notFound() from the page
// body alone arrives after the 200 has been sent.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const asLine = storeLines.find((l) => l.slug === slug);
  if (asLine) {
    const title = `${asLine.label} · Bohemia Health`;
    return {
      title,
      description: asLine.tagline,
      openGraph: { title, description: asLine.tagline, images: [og(asLine.image.src)] },
    };
  }
  const res = await api.products[":slug"].$get({ param: { slug } });
  if (!res.ok) notFound();
  const product = await res.json();
  const title = `${product.title} · Bohemia Health`;
  const line = lineFor(product.title);
  return {
    title,
    description: line ? `${line.label}. ${line.tagline}` : undefined,
    openGraph: {
      title,
      images: [og(line?.image.src ?? "/store/mito-vial.png")],
    },
  };
}

// /shop/<slug> is a line page when the slug names a line (the footer and the
// category chips link there), else a product page. Lines are checked first
// so a product can never shadow one; a product slug that collides with a
// line slug would need renaming, which the admin site should refuse.
//
// Product page. One item_codes row is the product; its items rows are the
// size variants. Image on the left in a soft grey field (the line's cut-out
// until items carry their own), the buy box on the right: line, title,
// code, dose dots, price for the chosen dose, Add to Bag. Two short trust
// lines underneath point at the lab reports and the disclaimer.
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const asLine = storeLines.find((l) => l.slug === slug);
  if (asLine) {
    const res = await api.items.$get();
    const catalog = res.ok ? toStoreProducts(await res.json()) : [];
    const products = catalog.filter((p) => p.line?.slug === asLine.slug);
    // Lines with stock, for the bar across the top: hop between them.
    const stocked = storeLines.filter((l) =>
      catalog.some((p) => p.line?.slug === l.slug),
    );
    return <LinePage line={asLine} products={products} stocked={stocked} />;
  }

  const res = await api.products[":slug"].$get({ param: { slug } });
  if (!res.ok) notFound();
  const product = await res.json();

  // "You may also like": other products, in an order that is random per
  // product but stable across renders (the slug is the seed). Excludes this
  // product so none of its own sizes show up. Has to follow the product
  // fetch: the API excludes by item_codes id, which only that gives us.
  const alsoRes = await api.items.recommended.$get({
    query: { seed: slug, count: "8", exclude: product.id },
  });
  // A failed recommendations call is no rail, not an error page over a
  // product that loaded fine.
  const alsoLike = alsoRes.ok ? toStoreProducts(await alsoRes.json()) : [];

  const line = lineFor(product.title);
  const variants: StoreVariant[] = product.variants
    .map((v) => {
      const price = Number(v.price);
      const mg = Number(v.size);
      return {
        id: v.id,
        size: v.size,
        mg: Number.isFinite(mg) && mg > 0 ? mg : undefined,
        form: v.form,
        price: price > 0 ? price : undefined,
      };
    })
    .sort((a, b) => (a.mg ?? Infinity) - (b.mg ?? Infinity));

  return (
    <main>
      <SetBreadcrumb
        items={[{ label: "Store", href: "/shop" }, { label: product.title }]}
      />

      <div
        className={cn(
          storeColumn,
          "grid items-start gap-10 py-10 md:grid-cols-2 md:gap-16 md:py-16 lg:gap-24",
        )}
      >
        <div className="relative aspect-square overflow-hidden rounded-[18px] bg-footer">
          {line && (
            <Image
              src={line.image.src}
              alt={line.image.alt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className={cn("object-contain p-12 md:p-16", line.image.className)}
            />
          )}
        </div>

        <div className="md:pt-6">
          {line && (
            <Link
              href={`/shop#${line.slug}`}
              className="text-[14px] font-light text-indigo-500 hover:underline"
            >
              {line.label}
            </Link>
          )}
          <h1 className="mt-2 text-[40px] font-medium leading-none tracking-tight md:text-[56px]">
            {product.title}
          </h1>
          <p className="mt-3 text-[14px] font-light text-muted-foreground">
            Product code {product.code}
          </p>

          <ProductBuyBox variants={variants} />

          <ul className="mt-12 flex flex-col divide-y divide-foreground/10 border-y border-foreground/10 text-[14px] font-light">
            <li className="flex items-center justify-between gap-6 py-4">
              <span>Every batch tested by an independent lab.</span>
              <Link
                href="/repository"
                className="inline-flex shrink-0 items-center text-[#0065CC] hover:underline"
              >
                Find your report
                <ChevronRight size={16} />
              </Link>
            </li>
            <li className="flex items-center justify-between gap-6 py-4">
              <span>Research use only.</span>
              <Link
                href="/legal/disclaimer"
                className="inline-flex shrink-0 items-center text-[#0065CC] hover:underline"
              >
                Read the disclaimer
                <ChevronRight size={16} />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* The store field again, so the rail reads as the store continuing. */}
      {alsoLike.length > 0 && (
        <div className="bg-[#f5f5f7] py-4 md:py-8 dark:bg-background">
          <ProductRail
            id="also-like"
            lead="You may also like."
            rest="More from the catalogue."
            products={alsoLike}
          />
        </div>
      )}

      <SetFootnotes
        notes={[
          "All products are supplied for laboratory research use only and are not intended for human or veterinary use.",
        ]}
      />
    </main>
  );
}
