import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SetLocalNav, SetNavbar } from "@asclepius/ui";
import { Rail, RailItem } from "@/components/rail/Rail";
import ProductRail from "@/components/store/ProductRail";
import StoreDifference from "@/components/store/StoreDifference";
import StoreHeading from "@/components/store/StoreHeading";
import FeatureTile from "@/components/store/FeatureTile";
import {
  storeLines,
  storePromos,
  toStoreProducts,
} from "@/components/store/lines";
import { storeColumn } from "@/components/store/types";

// Everything on /shop that depends on the catalogue: "The latest.", one rail
// per line with stock, "Help is here.", "Coming to the store." and the
// difference row, plus the LocalNav (its links are the rails that exist).
// Rendered inside Suspense by the page so the header and chips do not wait.
export default async function StoreRails() {
  // If Asclepius is unreachable the store still has a page: the rails that
  // need data show the restocking line, and everything that does not (help,
  // coming soon, the difference row) renders as usual.
  const catalog = await loadCatalog();

  // No created_at on items yet, so "the latest" is the first eight.
  const latest = catalog.slice(0, 8);

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
          { href: "#latest", label: "The latest" },
          ...rails.map(({ line }) => ({
            href: `#${line.slug}`,
            label: line.label,
          })),
          { href: "#help", label: "Help" },
        ]}
      />

      <div className="mt-6 flex flex-col md:mt-10">
        {latest.length > 0 ? (
          <ProductRail
            id="latest"
            lead="The latest."
            rest="Take a look at what's new, right now."
            products={latest}
            leading={storePromos.map((promo) => (
              <FeatureTile key={promo.href} {...promo} priority />
            ))}
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

        {/* One rail per line. Each closes on a tile that points somewhere
            useful for that line, alternating lab reports and Stuart so two
            rails in a row never end the same way. */}
        {rails.map(({ line, products }, i) => (
          <ProductRail
            key={line.slug}
            id={line.slug}
            lead={`${line.label}.`}
            rest={line.tagline}
            products={products}
            trailing={
              i % 2 === 0 ? (
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
                  tone="dark"
                  eyebrow="Need help choosing?"
                  title="Ask Stuart which size fits your protocol."
                  cta="Ask Stuart"
                  href="/shop/goto/stuart"
                  image={{
                    src: "/campaign/holographic_logomark.png",
                    alt: "The Bohemia mark as holographic glass",
                    className: "scale-90",
                  }}
                />
              )
            }
          />
        ))}

        {/* Help is here: Apple's feature tiles, 480×500, one per place a
            buyer might want to go next. */}
        <section id="help" className="scroll-mt-12 py-8 md:py-12">
          <div className={storeColumn}>
            <StoreHeading
              lead="Help is here."
              rest="Whenever and however you need it."
              className="mb-6 md:mb-8"
            />
          </div>
          <Rail label="Help is here">
            <RailItem>
              <FeatureTile
                size="feature"
                eyebrow="Lab reports"
                title="Every batch tested by an independent lab before it ships."
                cta="Find your report"
                href="/repository"
                image={{
                  src: "/vials-in-a-line.png",
                  alt: "Four empty glass vials in a row",
                }}
              />
            </RailItem>
            <RailItem>
              <FeatureTile
                size="feature"
                tone="dark"
                eyebrow="Group buys"
                title="Bring the price down for everyone in the buy."
                cta="See open group buys"
                href="/campaign"
                image={{
                  src: "/campaign/pumpkin_asset.webp",
                  alt: "A carved pumpkin glowing with the Bohemia mark",
                }}
                bleed
              />
            </RailItem>
            <RailItem>
              <FeatureTile
                size="feature"
                eyebrow="Ask Stuart"
                title="Not sure where to start? Stuart knows the catalogue."
                cta="Start a chat"
                href="/shop/goto/stuart"
                image={{
                  src: "/adalank-crop.png",
                  alt: "Nasal spray with a purple nozzle",
                }}
              />
            </RailItem>
            <RailItem>
              <FeatureTile
                size="feature"
                eyebrow="Research use only"
                title="Stated plainly on every listing, and in the fine print."
                cta="Read the disclaimer"
                href="/legal/disclaimer"
                image={{
                  src: "/store/amber-vial.png",
                  alt: "Amber vial",
                }}
              />
            </RailItem>
          </Rail>
        </section>

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
                    cta="Ask Stuart when"
                    href="/shop/goto/stuart"
                    image={line.image}
                  />
                </RailItem>
              ))}
            </Rail>
          </section>
        )}

        <StoreDifference />
      </div>

    </>
  );
}

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

// What the page shows while the catalogue loads: "The latest." as a bar and
// four tile shapes, the same 400×500 boxes, pulsing quietly.
export function RailsSkeleton() {
  return (
    <section className={cn(storeColumn, "mt-6 py-8 md:mt-10 md:py-12")} aria-hidden>
      <div className="mb-6 h-8 w-80 animate-pulse rounded bg-foreground/[0.08] md:mb-8" />
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-[440px] w-[290px] shrink-0 animate-pulse rounded-[18px] bg-card p-7 md:h-[500px] md:w-[400px]",
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
