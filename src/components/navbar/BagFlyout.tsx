"use client";
import Link from "next/link";
import { Bookmark, Settings, Package } from "lucide-react";
import { Flyout } from "./Flyout";

import type { BagLine } from "../bag/types";
import BagItem from "../bag/BagItem";

const bagLinks = [
  { id: 1, label: "Orders", icon: Package, href: "/orders/list" },
  { id: 2, label: "Your Saves", icon: Bookmark, href: "/saves" },
  { id: 3, label: "Account", icon: Settings, href: "/account" },
];

type Props = { open: boolean; onClose: () => void; lines: BagLine[] };

// Bag content inside the shared Flyout shell.
export function BagFlyout({ open, onClose, lines }: Props) {
  return (
    <Flyout id="bag-flyout" label="Shopping bag" open={open} onClose={onClose}>
      {lines.length === 0 ? (
        <>
          <h2 className="text-2xl font-medium">Your Bag is empty.</h2>
          <p className="mt-2 text-[11.5px] font-light text-muted-foreground">
            <Link
              href="/shop"
              onClick={onClose}
              className="text-[#007AFF] underline"
            >
              Shop Now
            </Link>{" "}
          </p>
        </>
      ) : (
        <>
          {/* Heading and the Review Bag button share the top row, like
              Apple's bag flyout. No subtotal here; /bag shows it. */}
          <div className="flex items-center justify-between gap-6">
            <h2 className="text-2xl font-medium">Bag</h2>
            <Link
              href="/bag"
              onClick={onClose}
              className="rounded-full bg-[#0071E3] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#0077ED]"
            >
              Review Bag
            </Link>
          </div>
          <ul className="mt-6 space-y-5">
            {lines.map((line) => (
              <BagItem key={line.itemId} line={line} />
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-10 text-xs font-light tracking-wider text-muted-foreground">
        My Profile
      </h3>
      <ul className="mt-3 space-y-2 text-xs font-medium">
        {bagLinks.map(({ id, href, label, icon: IconComponent }) => (
          <li key={id}>
            <Link
              href={href}
              onClick={onClose}
              className="flex items-center justify-start gap-3 text-foreground/80 hover:text-foreground transition-colors"
            >
              <IconComponent size={11} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Flyout>
  );
}
