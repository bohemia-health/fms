"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { Flyout } from "@asclepius/ui";
import { SearchResults } from "./SearchResults";

// Under the field, the places people most often search for. Same list
// styling as the bag flyout's My Profile links.
const quickLinks = [
  { label: "Store", href: "/shop" },
  { label: "Lab Reports", href: "/repository" },
  { label: "Group Buy", href: "/campaign" },
  { label: "Track an Order", href: "/orders/list" },
  { label: "Support", href: "/support" },
];

type Props = { open: boolean; onClose: () => void };

// Search content inside the shared Flyout shell: one borderless field with
// the search glyph to its left and a large placeholder, like Apple's. Typing
// shows live catalogue results under the field (SearchResults); submitting
// still goes to /search as a GET with ?q=.
export function SearchFlyout({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  // A closed panel forgets its query, so it opens empty next time. Done as
  // state derived from the previous `open` during render (React's pattern
  // for this) rather than in an effect, which would render twice.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setQuery("");
  }

  // Put the cursor in the field once the panel's text has faded in (the
  // content fade starts at 200ms); focusing during the height reveal would
  // scroll the page before the panel is there.
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement;
    const panel = inputRef.current?.closest('[role="dialog"]');
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250);
    return () => {
      clearTimeout(t);
      if (trigger instanceof HTMLElement &&
        (document.activeElement === document.body || panel?.contains(document.activeElement))) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [open]);

  return (
    <Flyout id="search-flyout" label="Search" open={open} onClose={onClose}>
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute top-1 right-3 flex size-11 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <X aria-hidden="true" className="size-5" />
      </button>
      <form action="/search" method="get" role="search">
        <label className="flex items-center gap-4">
          <Search
            className="size-6 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            name="q"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              // Down from the field lands on the first result, so a query
              // and one keystroke reach a product without the mouse.
              if (e.key !== "ArrowDown") return;
              const first = document.querySelector<HTMLAnchorElement>(
                "#search-flyout [data-slot=search-hit]",
              );
              if (first) {
                e.preventDefault();
                first.focus();
              }
            }}
            placeholder="Search bohemia health"
            autoComplete="off"
            className="min-w-0 w-full bg-transparent text-2xl font-medium tracking-tight outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:appearance-none"
          />
        </label>
      </form>

      <SearchResults query={query} onPick={onClose} />

      <h3 className="mt-10 text-sm font-normal text-muted-foreground">
        Quick Links
      </h3>
      <ul className="mt-3 space-y-1 text-base font-medium">
        {quickLinks.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={onClose}
              className="flex min-h-10 items-center justify-start gap-3 text-foreground/80 hover:text-foreground transition-colors"
            >
              <ArrowRight size={16} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Flyout>
  );
}
