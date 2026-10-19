"use client";
import Link from "next/link";
import { Flyout } from "./Flyout";
import type { navLinks } from "./types";

type Props = { open: boolean; onClose: () => void; links: navLinks[] };

// The phone menu: the same links the desktop bar shows, stacked large inside
// the shared Flyout shell. Hidden from md up, where the bar shows them.
export function MenuFlyout({ open, onClose, links }: Props) {
  return (
    <div className="md:hidden">
      <Flyout id="menu-flyout" label="Menu" open={open} onClose={onClose}>
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="text-2xl font-medium tracking-tight text-foreground/90 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Flyout>
    </div>
  );
}
