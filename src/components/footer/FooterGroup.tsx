"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FooterGroup as FooterGroupData } from "./types";

// One heading + its links. Below md it is an accordion row like Apple's
// footer; from md up the state is ignored and the list is always shown.
export function FooterGroup({ group }: { group: FooterGroupData }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-muted-foreground/25 md:border-0 md:space-y-1.5">
      <h3 className="text-[12px] font-medium text-foreground/80">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between py-3.5 text-left md:pointer-events-none md:py-0"
        >
          {group.heading}
          <ChevronDown
            strokeWidth={1.75}
            className={cn(
              "size-3.5 transition-transform md:hidden",
              open && "rotate-180",
            )}
          />
        </button>
      </h3>
      <ul
        className={cn(
          "space-y-2 pb-4 md:block md:pb-0",
          open ? "block" : "hidden",
        )}
      >
        {group.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block text-[11.5px] leading-[1.4] text-foreground/65 hover:underline transition-colors text-shadow-muted-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
