"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";
import { useLocalNav } from "./context";

const BAR_HEIGHT = 48;

// Apple-style second bar. Renders nothing unless a page registered one via
// SetLocalNav. Whether it sticks is the page's call (sticky prop).
export default function LocalNav() {
  const { localNav } = useLocalNav();
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState<string | null>(null);

  // Only overlay pages care about scroll position. Everyone else is always
  // frosted, so skip the listener for them.
  useEffect(() => {
    if (!localNav?.overlay) return;
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [localNav?.overlay]);

  // Scroll spy for "#section" links: the active one is the last section whose
  // top has scrolled up past the bar. Pages with only path links get none.
  const hashLinks = localNav?.links.filter((l) => l.href.startsWith("#")) ?? [];
  const hashKey = hashLinks.map((l) => l.href).join(",");
  useEffect(() => {
    if (!hashKey) return;
    const ids = hashKey.split(",");
    const update = () => {
      let current: string | null = null;
      for (const href of ids) {
        const el = document.getElementById(href.slice(1));
        if (el && el.getBoundingClientRect().top - BAR_HEIGHT <= 1) current = href;
      }
      setActiveHash(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [hashKey]);

  if (!localNav) return null;

  // Transparent only while an overlay page is scrolled to the very top.
  const transparent = Boolean(localNav.overlay) && !scrolled;

  return (
    <div
      className={cn(
        "top-0 z-40 transition-colors duration-300",
        localNav.sticky && "sticky",
        transparent
          ? "bg-transparent text-black"
          : "bg-navbar/70 backdrop-saturate-150 backdrop-blur-xl text-foreground",
      )}
    >
      {/* Border sits inside the container's padding so it matches the text edges. */}
      <div className={container}>
        <div
          className={cn(
            "flex h-12 items-center justify-between border-b transition-colors duration-300",
            transparent ? "border-black/15" : "border-foreground/10",
          )}
        >
          <Link
            href={localNav.href ?? "#"}
            className="text-[19px] font-normal tracking-wide"
          >
            {localNav.title}
          </Link>
          <nav className="hidden md:flex h-full items-center gap-6">
            {localNav.links.map((link) => {
              const active = link.href === activeHash;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    // relative + h-full so the strip can sit on the bar's bottom border.
                    "relative flex h-full items-center text-[11px] font-light tracking-wide transition-colors",
                    transparent
                      ? "text-black/80 hover:text-black"
                      : "text-foreground/80 hover:text-foreground",
                    // Active: a 2px blue strip overlapping the 1px border below.
                    active &&
                      "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-[#0065CC] after:content-['']",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
