import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SetBreadcrumb, SetFootnotes } from "@asclepius/ui";
import ProductCard from "@/components/products/ProductCard";
import FeatureTile from "@/components/store/FeatureTile";
import StoreHeading from "@/components/store/StoreHeading";
import { storeColumn } from "@/components/store/types";
import { findProducts } from "@/app/shop/search";

interface PageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim();
  return { title: query ? `“${query}” · Search · Bohemia Health` : "Search · Bohemia Health" };
}

// Where the search field's Enter lands: the same matching as the flyout,
// every hit as a store tile on the grey field, with the field repeated at
// the top so the query can be changed without going back. A miss offers
// Stuart and the whole store.
export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const products = query ? await findProducts(query) : [];

  return (
    <main className="bg-[#f5f5f7] pb-12 md:pb-20 dark:bg-background">
      <header className={cn(storeColumn, "py-14 md:py-20")}>
        <h1 className="text-[56px] font-medium leading-none tracking-tight md:text-[76px]">
          Search
        </h1>
        <form action="/search" method="get" role="search" className="mt-8 max-w-xl">
          <label className="flex items-center gap-4 border-b border-foreground/20 pb-3 focus-within:border-foreground">
            <Search
              className="size-6 shrink-0 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              type="search"
              name="q"
              aria-label="Search"
              defaultValue={query}
              placeholder="Search bohemia health"
              autoComplete="off"
              className="w-full bg-transparent text-xl font-medium tracking-tight outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:appearance-none"
            />
          </label>
        </form>
      </header>

      <section className={cn(storeColumn, "py-8 md:py-12")}>
        <StoreHeading
          lead={
            !query
              ? "Type something."
              : products.length === 0
                ? `Nothing matches “${query}”.`
                : `${products.length} ${products.length === 1 ? "result" : "results"} for “${query}”.`
          }
          rest={
            !query
              ? "A product, a line, a compound."
              : products.length === 0
                ? "Try a line name, or ask Stuart."
                : ""
          }
          className="mb-6 md:mb-8"
        />
        <div className="flex flex-wrap gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {query && products.length === 0 && (
            <>
              <FeatureTile
                tone="dark"
                eyebrow="Need help finding it?"
                title="Ask Stuart. He knows the catalogue."
                cta="Start a chat"
                href="/shop/goto/stuart"
                image={{
                  src: "/campaign/holographic_logomark.png",
                  alt: "The Bohemia mark as holographic glass",
                  className: "scale-90",
                }}
              />
              <FeatureTile
                eyebrow="Or browse"
                title="Every line, every size, in the store."
                cta="Go to the store"
                href="/shop"
                image={{
                  src: "/vials-in-a-line.png",
                  alt: "Four empty glass vials in a row",
                }}
              />
            </>
          )}
        </div>
      </section>

      <p className={cn(storeColumn, "mt-4 text-sm font-light text-muted-foreground")}>
        Looking for a lab report?{" "}
        <Link href="/repository" className="text-[#0065CC] hover:underline">
          Search the repository
        </Link>
        .
      </p>

      <SetBreadcrumb items={[{ label: "Search" }]} />
      <SetFootnotes
        notes={[
          "All products are supplied for laboratory research use only and are not intended for human or veterinary use.",
        ]}
      />
    </main>
  );
}
