import Link from "next/link";
import { cn } from "@/lib/utils";
import FeatureTile from "@/components/store/FeatureTile";
import StoreHeading from "@/components/store/StoreHeading";
import { storeColumn } from "@/components/store/types";

// A product slug that matches nothing: say so in the store's own voice and
// offer the two useful exits, rather than the bare framework 404.
export default function ProductNotFound() {
  return (
    <main className="bg-[#f5f5f7] pb-12 md:pb-20 dark:bg-background">
      <header className={cn(storeColumn, "py-14 md:py-20")}>
        <p className="text-[14px] font-light text-indigo-500">
          <Link href="/shop" className="hover:underline">
            Store
          </Link>
        </p>
        <h1 className="mt-2 text-[56px] font-medium leading-none tracking-tight md:text-[76px]">
          Not in the store.
        </h1>
      </header>
      <section className={cn(storeColumn, "py-8 md:py-12")}>
        <StoreHeading
          lead="That product isn't listed."
          rest="It may have moved, or never existed."
          className="mb-6 md:mb-8"
        />
        <div className="flex flex-wrap gap-5">
          <FeatureTile
            eyebrow="Browse"
            title="Every line, every size, in the store."
            cta="Go to the store"
            href="/shop"
            image={{
              src: "/vials-in-a-line.png",
              alt: "Four empty glass vials in a row",
            }}
          />
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
        </div>
      </section>
    </main>
  );
}
