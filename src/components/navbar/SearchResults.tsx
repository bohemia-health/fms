"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { searchCatalogue, type SearchHit } from "@/app/shop/search";

// Live results under the search field: up to six products matching the
// query, each a row with the line's cut-out, the title, and price + sizes.
// The query is debounced 150ms; while a request is out the previous results
// stay on screen, dimmed, rather than blinking to empty between keystrokes.
// A response for a query that is no longer the current one is dropped, so
// a slow answer for "reta" can never overwrite the results for "retatrutide".
// Rows fade in with a short stagger; nothing animates on the way out.
export function SearchResults({
  query,
  onPick,
}: {
  query: string;
  onPick: () => void;
}) {
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [pending, setPending] = useState(false);
  const q = query.trim();

  // A new query is pending from the keystroke, and an emptied field drops
  // its rows at once. Derived during render from the previous query, so the
  // effect below only has to do the asynchronous part.
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setPending(Boolean(q));
    if (!q) setHits([]);
  }

  useEffect(() => {
    if (!q) return;
    let current = true;
    const t = setTimeout(async () => {
      const found = await searchCatalogue(q).catch(() => []);
      if (!current) return;
      setHits(found);
      setPending(false);
    }, 150);
    return () => {
      current = false;
      clearTimeout(t);
    };
  }, [q]);

  if (!q) return null;

  if (hits.length === 0) {
    return (
      <p
        className={cn(
          "mt-8 text-sm font-light text-muted-foreground transition-opacity duration-200",
          pending && "opacity-50",
        )}
      >
        {pending ? "Searching…" : `Nothing in the store matches “${q}”.`}
      </p>
    );
  }

  return (
    <div className={cn("mt-8 transition-opacity duration-200", pending && "opacity-50")}>
      <h3 className="text-xs font-light tracking-wider text-muted-foreground">
        Products
      </h3>
      <ul className="mt-3 divide-y divide-foreground/10">
        {hits.map((hit, i) => (
          <li
            key={hit.href}
            className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-200 ease-out motion-reduce:animate-none"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <Link
              href={hit.href}
              data-slot="search-hit"
              onClick={onPick}
              onKeyDown={(e) => {
                // Up and down walk the list; up from the first goes back to
                // the field. Left to the browser otherwise.
                if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                const hits = Array.from(
                  document.querySelectorAll<HTMLAnchorElement>(
                    "#search-flyout [data-slot=search-hit]",
                  ),
                );
                const at = hits.indexOf(e.currentTarget);
                const next = e.key === "ArrowDown" ? hits[at + 1] : hits[at - 1];
                e.preventDefault();
                if (next) next.focus();
                else if (e.key === "ArrowUp")
                  document
                    .querySelector<HTMLInputElement>("#search-flyout input")
                    ?.focus();
              }}
              className="group/hit flex items-center gap-4 rounded-lg py-3 outline-none transition-[scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-[#0065CC] active:scale-[0.99]"
            >
              <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-foreground/[0.05]">
                <Image
                  src={hit.image.src}
                  alt={hit.image.alt}
                  fill
                  sizes="48px"
                  className={cn("object-contain p-1.5", hit.image.className)}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium group-hover/hit:underline">
                  {hit.title}
                </span>
                <span className="block truncate text-[13px] font-light text-muted-foreground">
                  {hit.line ? `${hit.line} · ` : ""}
                  {hit.detail}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
