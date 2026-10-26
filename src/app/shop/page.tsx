import Link from "next/link";
import { ChevronRight, MoveUpIcon, MoveUpRightIcon } from "lucide-react";
import { db } from "@/index";
import { itemTable, itemCodes } from "@/db";
import { eq } from "drizzle-orm";
import { container } from "@asclepius/ui";
import { cn } from "@/lib/utils";
import { Rail, RailItem } from "@/components/rail/Rail";
import CategoryChip from "@/components/store/CategoryChip";
import ProductRail from "@/components/store/ProductRail";
import StoreDifference from "@/components/store/StoreDifference";
import {
  storeHelpLinks,
  storeLines,
  toStoreProduct,
} from "@/components/store/lines";
import { SetBreadcrumb } from "@asclepius/ui";
import { SetFootnotes } from "@asclepius/ui";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";

export default async function ShopPage() {
  const rows = await db
    .select({
      id: itemTable.id,
      name: itemTable.name,
      size: itemTable.size,
      form: itemTable.form,
      price: itemTable.price,
      slug: itemCodes.slug,
    })
    .from(itemTable)
    .leftJoin(itemCodes, eq(itemTable.item_code_id, itemCodes.id))
    .orderBy(itemTable.name);

  const catalog = rows.map(toStoreProduct);

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

  return (
    <main className="mb-12 md:mb-20 ">
      {/* 
      <header
        className={cn(
          container,
          "flex flex-col gap-8 pt-10 pb-10 md:flex-row md:items-end md:justify-between md:pt-16 md:pb-14",
        )}
      >
        <h1 className="text-5xl font-medium leading-none md:text-7xl">Store</h1>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-10">
          <p className="max-w-xs text-xl leading-tight text-muted-foreground md:pl-6 md:-indent-6 md:text-2xl">
            The best way to buy the products you love.
          </p>
        </div>

        <ul className="flex flex-col gap-4 sm:flex-row sm:gap-8 md:shrink-0 md:gap-10">
          {storeHelpLinks.map(({ icon: Icon, lead, label, href }) => (
            <li key={href} className="flex items-start gap-3 sm:max-w-[11rem]">
              <Icon
                size={30}
                strokeWidth={1.25}
                className="mt-0.5 shrink-0 text-foreground/80"
              />
              <p className="text-[12px] leading-[1.35]">
                <span className="block font-light text-foreground/80">
                  {lead}
                </span>
                <Link
                  href={href}
                  className="inline-flex items-center whitespace-nowrap font-light text-[#0065CC] hover:underline"
                >
                  {label}
                  <ChevronRight size={14} />
                </Link>
              </p>
            </li>
          ))}
        </ul> 
      </header> */}

      <header className="flex justify-between mx-auto w-full max-w-[1520px] px-4 py-24">
        {/* Start of Store Header and Tagline */}
        <h1 className="text-[76px] font-medium tracking-tight">Store</h1>
        <div className="flex flex-col gap-5">
          <p className="text-[27px] max-w-xs leading-8 text-right">
            The best way to buy the products you love.
          </p>
          <div className="flex flex-col items-end gap-2">
            <Link
              href="/"
              className="inline-flex text-[#0065CC] text-sm font-light tracking-wide hover:underline"
            >
              Connect with a Specialist <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/repository/goto/search"
              className="inline-flex text-[#0065CC] text-sm font-light tracking-wide hover:underline"
            >
              Find a Lab Report <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
        {/* End of the Store Header and Tagline */}
      </header>

      {/* Category doorways: every line, whether or not it has stock today. */}
      <Rail
        label="Product lines"
        className="gap-4 md:gap-6"
        controls={false}
        contained
      >
        {storeLines.map((line) => (
          <RailItem key={line.slug}>
            <CategoryChip line={line} href={`#${line.slug}`} />
          </RailItem>
        ))}
      </Rail>

      <div className="mt-6 flex flex-col md:mt-10">
        {latest.length > 0 ? (
          <ProductRail
            id="latest"
            lead="The latest."
            rest="Take a look at what's new, right now."
            products={latest}
          />
        ) : (
          <p
            id="latest"
            className={cn(
              container,
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
        <StoreDifference />
      </div>

      <SetBreadcrumb items={[{ label: "Store" }]} />
      <SetFootnotes
        notes={[
          "All products are supplied for laboratory research use only and are not intended for human or veterinary use.",
        ]}
      />
    </main>
  );
}
