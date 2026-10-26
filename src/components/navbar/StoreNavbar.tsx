"use client";
import { Navbar, type NavLink } from "@asclepius/ui";
import { BagFlyout } from "./BagFlyout";
import { SearchFlyout } from "./SearchFlyout";
import type { BagLine } from "../bag/types";

type Props = { links: NavLink[]; lines: BagLine[] };

// The store's Navbar: the shared bar with the store's own bag and search
// panels. A client component because the panels are render props, which the
// server-side layout cannot hand to the package's Navbar directly.
export default function StoreNavbar({ links, lines }: Props) {
  // Badge shows units, not rows: two of one item reads 2.
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  return (
    <Navbar
      links={links}
      bag={{ count, flyout: (p) => <BagFlyout {...p} lines={lines} /> }}
      search={(p) => <SearchFlyout {...p} />}
    />
  );
}
