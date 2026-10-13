"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";
import { useLocalNav } from "./context";

// Apple-style second bar. Renders nothing unless a page registered one via
// SetLocalNav. Whether it sticks is the page's call (sticky prop).
export default function LocalNav() {
  const { localNav } = useLocalNav();
  if (!localNav) return null;

  return (
    <div
      className={cn(
        "top-0 z-40 bg-navbar/70 backdrop-saturate-150 backdrop-blur-xl",
        localNav.sticky && "sticky",
      )}
    >
      {/* Border sits inside the container's padding so it matches the text edges. */}
      <div className={container}>
        <div className="flex h-12 items-center justify-between border-b border-foreground/10">
          <Link
            href={localNav.href ?? "#"}
            className="text-[19px] font-normal tracking-wide text-foreground"
          >
            {localNav.title}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {localNav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-light tracking-wide text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
