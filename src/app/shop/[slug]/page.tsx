import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  SetBreadcrumb,
  SetFootnotes,
  SetLocalNav,
  SetNavbar,
} from "@asclepius/ui";
import { lineFor, storeLines, toStoreProducts } from "@/components/store/lines";
import type { StoreVariant } from "@/components/store/types";
import ProductRail from "@/components/store/ProductRail";
import Configurator from "./Configurator";
import { labReportUrl } from "@/integrations/b2/client";
import PromotionDialog from "./PromotionDialog";
import Gallery from "./Gallery";
import LinePage from "./LinePage";
import { SITE_URL } from "@/app/sitemap";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Apple's buy-page column: 6.2% margins at every width (79px at 1280, 119 at
// 1920), so the gallery grows with the window instead of stopping at the
// store's 1520px box. The ribbon is told to use the same column.
const buyColumn = "mx-auto w-full px-[max(16px,6.2vw)]";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Open Graph wants absolute image URLs; the line cut-outs are in /public.
const og = (path: string) => `${SITE_URL}${path}`;

// Tab title: the line's name for a line page, the product's for a product.
// An unknown slug 404s from here: metadata resolves before the response
// starts streaming, so the status is a real 404; a notFound() from the page
// body alone arrives after the 200 has been sent.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const asLine = storeLines.find((l) => l.slug === slug);
  if (asLine) {
    const title = `${asLine.label} · Bohemia Health`;
    return {
      title,
      description: asLine.tagline,
      openGraph: {
        title,
        description: asLine.tagline,
        images: [og(asLine.image.src)],
      },
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

  // Stock per size and vendor, for the configurator to grey out what we
  // cannot fill. A failed call is "nothing greyed out", not an error page.
  const stockRes = await api.products[":slug"].availability.$get({
    param: { slug },
  });
  // Report links are built here: the bucket URL is a server env var.
  const stock = stockRes.ok
    ? (await stockRes.json()).map((r) => ({
        ...r,
        coaUrl: r.coaKey ? labReportUrl(r.coaKey) : null,
      }))
    : [];

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

  // What the header, ribbon and Size step show. The lowest-priced variant is
  // "Buy from"; the campaign line is a placeholder until campaigns carry a
  // close date (see the Todoist task).
  const lowest = variants.find((v) => v.price !== undefined)?.price;
  const priceLines = [
    lowest !== undefined
      ? `Buy from ${money.format(lowest)}`
      : "Price on request",
    "Or pre-order in a Campaign for $90.",
  ];

  return (
    <main className={cn(buyColumn, "mt-12")}>
      <SetBreadcrumb
        items={[{ label: "Store", href: "/shop" }, { label: product.title }]}
      />
      {/* Apple's buy page: the global nav scrolls away and the product
          ribbon alone pins at the top once the header has passed. */}
      <SetNavbar sticky={false} />
      <SetLocalNav
        sticky
        containerClassName={buyColumn}
        title={product.title}
        titleClassName="font-medium tracking-tight"
        href={`/shop/${slug}`}
        links={[]}
        detail={priceLines}
        detailClassName="font-medium"
        revealAfter="product-header"
        border="full"
        subbar={[
          { icon: "clock", label: "Ships in 1-2 business days" },
          { icon: "truck", label: "Free shipping" },
          { icon: "coins", label: "Stablecoin accepted" },
        ]}
      />

      <div
        id="product-header"
        className="flex items-center justify-between gap-6"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-medium tracking-tight">
            Shop {product.title}
          </h1>
          <div className="flex flex-col">
            {priceLines.map((l) => (
              <p key={l} className="text-[15px] leading-5">
                {l}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <PromotionDialog />
        </div>
      </div>

      {/* Buy flow, Apple's shape: the gallery sticks on the left while the
          right column scrolls one decision at a time. */}
      <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_328px] lg:gap-x-[60px]">
        {/* The sticky box is the whole viewport below the navbar and ribbon
            (the 98px ribbon; the navbar scrolls away here), and the gallery centres in it, so it floats mid-screen
            while the column scrolls instead of hugging the top. */}
        <div className="lg:sticky lg:top-[98px] lg:flex lg:h-[calc(100vh-98px)] lg:items-center lg:self-start">
          <Gallery
            slides={[
              {
                key: "caps",
                image: {
                  src: "/store/vial_marketing_image.png",
                  alt: "Two vial caps with purple elastomeric closures, seen from above",
                },
                imageClassName: "object-bottom",
                caption: (
                  <>
                    Batches feature unique vial cap and elastomeric rubber
                    closures designed to{" "}
                    <span className="text-foreground">
                      maintain an airtight, negative pressure environment
                    </span>
                  </>
                ),
              },
              ...(line
                ? [
                    {
                      key: "line",
                      image: line.image,
                      imageClassName: cn("p-[10cqw]", line.image.className),
                    },
                  ]
                : []),
            ]}
          />
        </div>

        <aside className="mt-12 lg:mt-0">
          <Configurator variants={variants} stock={stock}>
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
          </Configurator>
        </aside>
      </div>

      {/* The store field again, so the rail reads as the store continuing. */}
      {alsoLike.length > 0 && (
        <div className="-mx-[max(16px,6.2vw)] mt-16 bg-[#f5f5f7] py-4 md:py-8 dark:bg-background">
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
