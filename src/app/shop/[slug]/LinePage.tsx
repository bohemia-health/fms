import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  SetBreadcrumb,
  SetFootnotes,
  SetLocalNav,
  SetNavbar,
} from "@asclepius/ui";
import { Rail, RailItem } from "@/components/rail/Rail";
import ProductCard from "@/components/products/ProductCard";
import FeatureTile from "@/components/store/FeatureTile";
import StoreDifference from "@/components/store/StoreDifference";
import StoreHeading from "@/components/store/StoreHeading";
import { storeColumn, type StoreLine, type StoreProduct } from "@/components/store/types";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";

// A line's own page at /shop/<line>, where the footer and the category chips
// already pointed: the store header's shape with the line's name and tagline,
// then every product in the line as a grid of store tiles (a grid, not a
// rail, since this page is the whole line), the lab-report pointer, and the
// difference row. An empty line says so instead of showing nothing.
export default function LinePage({
  line,
  products,
  stocked,
}: {
  line: StoreLine;
  products: StoreProduct[];
  /** Lines that have something in stock: the bar's links. */
  stocked: StoreLine[];
}) {
  return (
    <main className="bg-[#f5f5f7] pb-12 md:pb-20 dark:bg-background">
      {/* The same sticky Store bar as /shop, one link per stocked line, so
          the lines read as sections of one store rather than separate pages. */}
      <SetNavbar sticky={false} />
      <SetLocalNav
        title="Store"
        href="/shop"
        sticky
        links={stocked.map((l) => ({ href: `/shop/${l.slug}`, label: l.label }))}
      />
      <header
        className={cn(
          storeColumn,
          "flex flex-col gap-8 py-14 md:flex-row md:justify-between md:py-24",
        )}
      >
        <div>
          <p className="text-[14px] font-light text-indigo-500">
            <Link href="/shop" className="hover:underline">
              Store
            </Link>
          </p>
          <h1 className="mt-2 text-[56px] font-medium leading-none tracking-tight md:text-[76px]">
            {line.label}
          </h1>
        </div>
        <div className="flex flex-col gap-5 md:items-end">
          <p className="max-w-xs text-[23px] leading-7 md:text-right md:text-[27px] md:leading-8">
            {line.tagline}
          </p>
          <div className="flex flex-col gap-2 md:items-end">
            <Link
              href="/repository"
              className="inline-flex text-[#0065CC] text-sm font-light tracking-wide hover:underline"
            >
              Find a Lab Report <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/shop/goto/stuart"
              className="inline-flex text-[#0065CC] text-sm font-light tracking-wide hover:underline"
            >
              Ask Stuart <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section id="products" className="scroll-mt-12 py-8 md:py-12">
        <div className={storeColumn}>
          <StoreHeading
            lead={products.length > 0 ? `All ${line.label}.` : "Nothing in stock yet."}
            rest={
              products.length > 0
                ? `${products.length} ${products.length === 1 ? "product" : "products"}.`
                : "Stuart can tell you when there is."
            }
            className="mb-6 md:mb-8"
          />
        </div>
        <Rail label={`${line.label} products`}>
          {products.map((product) => (
            <RailItem key={product.id}>
              <ProductCard product={product} />
            </RailItem>
          ))}
          <RailItem>
            {products.length > 0 ? (
              <FeatureTile
                eyebrow="Lab reports"
                title={`Every ${line.label} batch, on the record.`}
                cta="Find your report"
                href="/repository"
                image={{
                  src: "/vials-in-a-line.png",
                  alt: "Four empty glass vials in a row",
                }}
              />
            ) : (
              <FeatureTile
                eyebrow="Coming soon"
                title={line.label}
                tagline={line.tagline}
                cta="Ask Stuart when"
                href="/shop/goto/stuart"
                image={line.image}
              />
            )}
          </RailItem>
        </Rail>
      </section>

      <StoreDifference />

      <SetBreadcrumb
        items={[{ label: "Store", href: "/shop" }, { label: line.label }]}
      />
      <SetFootnotes
        notes={[
          "All products are supplied for laboratory research use only and are not intended for human or veterinary use.",
        ]}
      />
    </main>
  );
}
