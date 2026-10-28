import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, MoveUpIcon, MoveUpRightIcon } from "lucide-react";
import { container } from "@asclepius/ui";
import { cn } from "@/lib/utils";
import { Rail, RailItem } from "@/components/rail/Rail";
import CategoryChip from "@/components/store/CategoryChip";
import StoreRails, { RailsSkeleton } from "./StoreRails";
import { storeHelpLinks, storeLines } from "@/components/store/lines";
import { storeColumn } from "@/components/store/types";
import { SetBreadcrumb, SetFootnotes } from "@asclepius/ui";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";

export const metadata: Metadata = {
  title: "Store · Bohemia Health",
  description: "Research peptides by line, every batch lab tested.",
};

export default function ShopPage() {
  // The store field: apple.com/store is #f5f5f7 below the nav with white
  // tiles on it; in dark mode the page is black and the tiles are #1d1d1f.
  // The header and the category chips need no data, so they render at once;
  // the rails wait on the catalogue inside Suspense and stream in behind a
  // row of tile shapes. (A loading.tsx would do the same, but it wraps the
  // whole segment, product pages included, and a 404 after the shell has
  // streamed is a 200; see CHANGELOG 2026-10-27.)
  return (
    <main className="bg-[#f5f5f7] pb-12 md:pb-20 dark:bg-background">
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

      <header
        className={cn(
          storeColumn,
          "flex flex-col gap-8 py-14 md:flex-row md:justify-between md:py-24",
        )}
      >
        {/* Start of Store Header and Tagline */}
        <h1 className="text-[56px] font-medium leading-none tracking-tight md:text-[76px]">
          Store
        </h1>
        <div className="flex flex-col gap-5 md:items-end">
          <p className="max-w-xs text-[23px] leading-7 md:text-right md:text-[27px] md:leading-8">
            The best way to buy the products you love.
          </p>
          <div className="flex flex-col gap-2 md:items-end">
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

      <Suspense fallback={<RailsSkeleton />}>
        <StoreRails />
      </Suspense>

      <SetBreadcrumb items={[{ label: "Store" }]} />
      <SetFootnotes
        notes={[
          "All products are supplied for laboratory research use only and are not intended for human or veterinary use.",
        ]}
      />
    </main>
  );
}
