import {
  Bot,
  FlaskConical,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import type {
  StoreDifference,
  StoreHelpLink,
  StoreLine,
  StoreProduct,
} from "./types";

// The product lines, in the order their rails appear on the store page. The
// first three are the brand lines from the navbar; GLP-1 is deliberately
// last so it is never the lead. Add a line here and it gets a category chip,
// a rail, and a LocalNav link.
export const storeLines: StoreLine[] = [
  {
    slug: "mito",
    label: "GLP-1",
    tagline: "Energy at the source.",
    image: { src: "/store/mito-vial.png", alt: "placeholder image" },
    keywords: ["mots", "ss-31", "ss31", "mito", "nad", "humanin", "5-amino"],
  },
  {
    slug: "nootropic",
    label: "Mitochondria Derived",
    tagline: "Think in high definition.",
    image: {
      src: "/store/mito-vial.png",
      alt: "Nasal spray with a purple nozzle",
    },
    keywords: ["selank", "semax", "dihexa", "noopept", "cerebrolysin"],
  },
  {
    slug: "bioregulator",
    label: "GHRH analog",
    tagline: "Masters of all trades.",
    image: {
      src: "/store/mito-vial.png",
      alt: "Bioregulator vial with a green cap",
    },
    keywords: [
      "epitalon",
      "epithalon",
      "thymalin",
      "pinealon",
      "cortagen",
      "vilon",
      "cardiogen",
      "bioregulator",
    ],
  },
  {
    slug: "repair",
    label: "Repair Signaling",
    tagline: "Repair is an unremarkable thing.",
    image: {
      src: "/store/mito-vial.png",
      alt: "Thymosin Beta 4 vial with a pink cap",
      className: "object-top",
    },
    keywords: ["bpc", "tb-500", "tb500", "tb4", "thymosin", "ghk", "kpv"],
  },
  {
    slug: "glp1",
    label: "Fat Burning",
    tagline: "Metabolic research, measured.",
    image: { src: "/store/mito-vial.png", alt: "Amber vial" },
    keywords: [
      "tirzepatide",
      "retatrutide",
      "semaglutide",
      "cagrilintide",
      "glp",
    ],
  },

  {
    slug: "longevity",
    label: "Longevity",
    tagline: "Metabolic research, measured.",
    image: { src: "/store/mito-vial.png", alt: "Amber vial" },
    keywords: [
      "tirzepatide",
      "retatrutide",
      "semaglutide",
      "cagrilintide",
      "glp",
    ],
  },

  {
    slug: "mood",
    label: "Mood",
    tagline: "Metabolic research, measured.",
    image: { src: "/store/mito-vial.png", alt: "Amber vial" },
    keywords: [
      "tirzepatide",
      "retatrutide",
      "semaglutide",
      "cagrilintide",
      "glp",
    ],
  },

  {
    slug: "blends",
    label: "Blends",
    tagline: "Metabolic research, measured.",
    image: { src: "/store/mito-vial.png", alt: "Amber vial" },
    keywords: [
      "tirzepatide",
      "retatrutide",
      "semaglutide",
      "cagrilintide",
      "glp",
    ],
  },
  {
    slug: "accessories",
    label: "Accessories",
    tagline: "Everything but the vial.",
    image: {
      src: "/vials-in-a-line.png",
      alt: "Four empty glass vials in a row",
    },
    keywords: [
      "water",
      "bacteriostatic",
      "syringe",
      "needle",
      "swab",
      "alcohol",
      "kit",
      "empty vial",
    ],
  },

  {
    slug: "gift-cards",
    label: "Gift Cards",
    tagline: "Perfect Gift for a Fellow Man",
    image: {
      src: "/gift-card-mock.png",
      alt: "Four empty glass vials in a row",
    },
    keywords: [
      "water",
      "bacteriostatic",
      "syringe",
      "needle",
      "swab",
      "alcohol",
      "kit",
      "empty vial",
    ],
  },
];

// Keyword map: the first line with a keyword in the title wins. Replaces a
// `line` column on products until the schema carries one.
export function lineFor(title: string): StoreLine | undefined {
  const t = title.toLowerCase();
  return storeLines.find((line) => line.keywords.some((k) => t.includes(k)));
}

type ItemRow = {
  id: number | string;
  name: string;
  size: string;
  form: string;
  /** numeric columns come back as strings, e.g. "59.00". */
  price: string | null;
  /** item_codes.slug via the join; null when the item has no code or the code no slug. */
  slug?: string | null;
};

// items row -> what the cards need. Descriptor is "size · form"; a price of
// 0 (the column default) means not priced yet, so the card says "View pricing".
export function toStoreProduct(row: ItemRow): StoreProduct {
  const price = Number(row.price);
  return {
    id: String(row.id),
    title: row.name,
    descriptor: `${row.size} · ${row.form}`,
    price: price > 0 ? price : undefined,
    href: row.slug ? `/shop/${row.slug}` : "#",
    line: lineFor(row.name),
  };
}

export const storeHelpLinks: StoreHelpLink[] = [
  {
    icon: FlaskConical,
    lead: "Every batch on the record.",
    label: "See the lab reports",
    href: "/repository",
  },
  {
    icon: Bot,
    lead: "Need help choosing?",
    label: "Ask Stuart",
    href: "/support/stuart",
  },
];

export const storeDifferences: StoreDifference[] = [
  {
    icon: FlaskConical,
    text: "Every batch tested by an independent lab before it ships.",
    link: { label: "Find your report", href: "/repository" },
  },
  {
    icon: Users,
    text: "Group buys bring the price down for everyone in the buy.",
    link: { label: "See open group buys", href: "/campaign" },
  },
  {
    icon: ShieldCheck,
    text: "Research use only, stated plainly on every listing.",
    link: { label: "Read the disclaimer", href: "/legal/disclaimer" },
  },
  {
    icon: MessageCircle,
    text: "Real support from people who know the products.",
    link: { label: "Contact support", href: "/support" },
  },
];
