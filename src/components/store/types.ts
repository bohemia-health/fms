import type { LucideIcon } from "lucide-react";

export type StoreLine = {
  /** Anchor and path segment: "mito" -> "#mito" on this page, "/shop/mito" off it. */
  slug: string;
  label: string;
  /** The gray half of the rail heading: "MITO. Energy at the source." */
  tagline: string;
  image: {
    src: string;
    alt: string;
    /** Per-asset fit tweaks for the chip and card image boxes. */
    className?: string;
  };
  /** Lower-case fragments. A product whose title contains one belongs to this line. */
  keywords: string[];
};

export type StoreProduct = {
  id: string;
  title: string;
  /** Short gray line under the title: "10mg · injectable". */
  descriptor?: string;
  /** Dollars. Absent when the item is not priced yet. */
  price?: number;
  /** Where the card links. "#" until there is a product page. */
  href: string;
  line?: StoreLine;
};

export type StoreDifference = {
  /** Pass the icon component itself (FlaskConical), not an element. */
  icon: LucideIcon;
  text: string;
  link: { label: string; href: string };
};

export type StoreHelpLink = {
  icon: LucideIcon;
  lead: string;
  label: string;
  href: string;
};
