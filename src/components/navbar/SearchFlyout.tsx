"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Flyout } from "@asclepius/ui";

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
// the search glyph to its left and a large placeholder, like Apple's. For
// now it is only the look; submitting goes to /search as a GET with ?q=.
export function SearchFlyout({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Put the cursor in the field once the panel's text has faded in (the
  // content fade starts at 200ms); focusing during the height reveal would
  // scroll the page before the panel is there.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <Flyout id="search-flyout" label="Search" open={open} onClose={onClose}>
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
            placeholder="Search bohemia health"
            autoComplete="off"
            className="w-full bg-transparent text-xl font-medium tracking-tight outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:appearance-none"
          />
        </label>
      </form>

      <h3 className="mt-10 text-xs font-light tracking-wider text-muted-foreground">
        Quick Links
      </h3>
      <ul className="mt-3 space-y-2 text-xs font-medium">
        {quickLinks.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={onClose}
              className="flex items-center justify-start gap-3 text-foreground/80 hover:text-foreground transition-colors"
            >
              <ArrowRight size={11} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Flyout>
  );
}
