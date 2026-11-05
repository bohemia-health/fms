import Link from "next/link";
import { FlaskConical, MessageCircle, Users } from "lucide-react";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SetLocalNav, SetNavbar } from "@asclepius/ui";
import { Rail, RailItem } from "@/components/rail/Rail";
import ProductRail from "@/components/store/ProductRail";
import StoreHeading from "@/components/store/StoreHeading";
import FeatureTile from "@/components/store/FeatureTile";
import {
  storeLines,
  toStoreProducts,
} from "@/components/store/lines";
import { storeColumn } from "@/components/store/types";

// Stream the catalog and its navigation after the shop header and category links.
export default async function StoreRails() {
  // If Asclepius is unreachable the store still has a page: the rails that
  // need data show the restocking line, and everything that does not (help,
  // coming soon, the difference row) renders as usual.
  const catalog = await loadCatalog();

  const preview = catalog.filter((product) => product.href !== "#").slice(0, 8);

  // One rail per line, in storeLines order; lines with nothing in them
  // are skipped so the page never shows an empty row.
  const rails = storeLines
    .map((line) => ({
      line,
      products: catalog.filter((p) => p.line?.slug === line.slug),
    }))
    .filter((rail) => rail.products.length > 0);

  // Lines with nothing in stock yet. Their chips still need somewhere to
  // land, so each gets a "coming soon" tile at the foot of the page.
  const comingSoon = storeLines.filter(
    (line) => !rails.some((rail) => rail.line.slug === line.slug),
  );


  return (
    <>
      {/* Sticky second bar, one link per rail on the page (lines with stock
          only), so the rails' scroll-mt-12 has something to clear. The main
          navbar lets go so the two bars do not stack, as on /repository. */}
      <SetNavbar sticky={false} />
      <SetLocalNav
        title="Store"
        href="/shop"
        sticky
        links={[
          { href: "#latest", label: "Explore" },
          ...rails.map(({ line }) => ({
            href: `#${line.slug}`,
            label: line.label,
          })),
          { href: "#help", label: "Help" },
        ]}
      />

      <div className="mt-6 flex flex-col md:mt-10">
        {preview.length > 0 ? (
          <ProductRail
            id="latest"
            lead="Explore the catalog."
            rest="Browse products and compare available sizes."
            products={preview}
          />
        ) : (
          <p
            id="latest"
            className={cn(
              storeColumn,
              "scroll-mt-12 py-8 text-xl font-light text-muted-foreground md:py-12",
            )}
          >
            The shelves are being restocked. Check back soon.
          </p>
        )}

        {rails.map(({ line, products }) => (
          <ProductRail
            key={line.slug}
            id={line.slug}
            lead={`${line.label}.`}
            rest={line.tagline}
            products={products}
          />
        ))}

        {comingSoon.length > 0 && (
          <section id="coming-soon" className="scroll-mt-12 py-8 md:py-12">
            <div className={storeColumn}>
              <StoreHeading
                lead="Coming to the store."
                rest="Lines we are still stocking."
                className="mb-6 md:mb-8"
              />
            </div>
            <Rail label="Lines coming soon">
              {comingSoon.map((line) => (
                <RailItem
                  key={line.slug}
                  id={line.slug}
                  className="scroll-mt-12"
                >
                  <FeatureTile
                    eyebrow="Coming soon"
                    title={line.label}
                    tagline={line.tagline}
                    cta="Contact us"
                    href="/shop/goto/help"
                    image={line.image}
                  />
                </RailItem>
              ))}
            </Rail>
          </section>
        )}

        <section id="help" className={cn(storeColumn, "scroll-mt-20 pt-10 md:pt-16")}>
          <StoreHeading
            lead="Here when you need us."
            rest="Check a batch, join a group buy, or get help with the catalog."
            className="mb-6"
          />
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {shopLinks.map(({ icon: Icon, title, description, href, action }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-start rounded-3xl bg-card p-6 ring-1 ring-foreground/10 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0065CC] lg:p-8"
              >
                <Icon aria-hidden="true" className="size-6 text-[#0065CC] dark:text-[#66b0ff]" strokeWidth={1.5} />
                <h3 className="mt-4 text-xl font-medium tracking-tight">{title}</h3>
                <p className="mt-2 mb-5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[#0065CC] group-hover:underline dark:text-[#66b0ff]">
                  {action} <ArrowUpRight aria-hidden="true" className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

    </>
  );
}

const shopLinks = [
  {
    icon: FlaskConical,
    title: "See the original lab report.",
    description: "Look up independent lab results by compound or batch number.",
    href: "/repository",
    action: "Find your report",
  },
  {
    icon: Users,
    title: "Explore group buys.",
    description: "See what’s open and review the terms of each buy.",
    href: "/campaign",
    action: "See group buys",
  },
  {
    icon: MessageCircle,
    title: "Talk to Bohemia.",
    description: "Get help finding a product or understanding its options.",
    href: "/shop/goto/help",
    action: "Contact us",
  },
];

async function loadCatalog() {
  try {
    const res = await api.items.$get();
    if (!res.ok) return [];
    // One card per product; its sizes become the dose dots on the card.
    return toStoreProducts(await res.json());
  } catch (error) {
    console.error("[store] catalogue unavailable", error);
    return [];
  }
}

// Reserve room for the first product rail while the catalog loads.
export function RailsSkeleton() {
  return (
    <section className={cn(storeColumn, "mt-6 py-8 md:mt-10 md:py-12")} aria-hidden>
      <div className="mb-6 h-8 w-full max-w-80 motion-safe:animate-pulse rounded bg-foreground/[0.08] md:mb-8" />
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-[440px] w-[290px] shrink-0 motion-safe:animate-pulse rounded-[18px] bg-card p-7 md:h-[500px] md:w-[400px]",
              "shadow-[2px_4px_12px_rgba(0,0,0,0.08)] dark:shadow-none dark:ring-1 dark:ring-foreground/10",
            )}
          >
            <div className="h-3 w-16 rounded bg-foreground/[0.08]" />
            <div className="mt-4 h-7 w-40 rounded bg-foreground/[0.1]" />
            <div className="mt-3 h-3.5 w-52 rounded bg-foreground/[0.06]" />
          </div>
        ))}
      </div>
    </section>
  );
}
