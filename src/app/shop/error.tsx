"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import StoreHeading from "@/components/store/StoreHeading";
import { storeColumn } from "@/components/store/types";

// What a store route shows when its data fails (Asclepius down, a bad
// response): the store's own voice on the grey field, a retry that re-runs
// the segment, and the way back. Covers /shop and everything under it.
export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[store]", error);
  }, [error]);

  return (
    <main className="bg-[#f5f5f7] pb-12 md:pb-20 dark:bg-background">
      <header className={cn(storeColumn, "py-14 md:py-20")}>
        <p className="text-[14px] font-light text-indigo-500">
          <Link href="/shop" className="hover:underline">
            Store
          </Link>
        </p>
        <h1 className="mt-2 text-[56px] font-medium leading-none tracking-tight md:text-[76px]">
          One moment.
        </h1>
      </header>
      <section className={cn(storeColumn, "py-8 md:py-12")}>
        <StoreHeading
          lead="We couldn't reach the catalogue."
          rest="Nothing is wrong with your bag. Try again in a moment."
          className="mb-6 md:mb-8"
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="normal" onClick={reset} className="font-normal">
            Try again
          </Button>
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full border border-[#0071e3] px-[16px] py-[9px] text-[14px] font-light leading-[1.18] tracking-[-0.022em] text-[#0071e3] transition-colors hover:bg-[#0071e3] hover:text-white md:px-[22px] md:py-[12px] md:text-[16px]"
          >
            Back to the store
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-xs font-light text-muted-foreground">
            Reference {error.digest}
          </p>
        )}
      </section>
    </main>
  );
}
