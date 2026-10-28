import type { LucideIcon } from "lucide-react";

// The store column: 1520px max with a 16px gutter, the same box the store
// header, the category chips and the rail chevrons already use. Headings
// sit on it too, so a rail's first card starts on its heading's text edge.
export const storeColumn = "mx-auto w-full max-w-[1520px] px-4";

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

// One items row: a size of a product. `mg` is the size parsed as a number,
// absent when the size is not numeric ("1 kit").
export type StoreVariant = {
  id: string;
  size: string;
  mg?: number;
  form: string;
  /** Dollars. Absent when the item is not priced yet. */
  price?: number;
};

export type StoreProduct = {
  id: string;
  title: string;
  /** Short gray line under the title: "10mg · injectable". */
  descriptor?: string;
  /** Dollars. The lowest priced variant when there are several. */
  price?: number;
  /** Where the card links. "#" until there is a product page. */
  href: string;
  line?: StoreLine;
  /** Every size of this product, smallest first. Empty for a single-item view. */
  variants: StoreVariant[];
};

// A promo tile at the front of "The latest.": a pre-order, a launch. Copy
// lives in lines.ts so a new one is a data edit, not a JSX one.
export type StorePromo = {
  eyebrow: string;
  title: string;
  tagline: string;
  detail: string;
  href: string;
  image: { src: string; alt: string; className?: string };
  /** Eyebrow colour classes; orange for pre-orders. */
  accent?: string;
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
