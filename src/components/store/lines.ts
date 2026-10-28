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
  StorePromo,
  StoreVariant,
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
      src: "/adalank-crop.png",
      alt: "Nasal spray with a purple nozzle",
    },
    keywords: ["selank", "semax", "dihexa", "noopept", "cerebrolysin"],
  },
  {
    slug: "bioregulator",
    label: "GHRH analog",
    tagline: "Masters of all trades.",
    image: {
      src: "/bioreg_vial.png",
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
    image: { src: "/store/amber-vial.png", alt: "Amber vial" },
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
    image: { src: "/store/amber-vial.png", alt: "Amber vial" },
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
    image: { src: "/store/amber-vial.png", alt: "Amber vial" },
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
    image: { src: "/store/amber-vial.png", alt: "Amber vial" },
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
  const variant = toVariant(row);
  return {
    id: String(row.id),
    title: row.name,
    descriptor: describe(variant),
    price: variant.price,
    href: row.slug ? `/shop/${row.slug}` : "#",
    line: lineFor(row.name),
    variants: [variant],
  };
}

// "30 mg · injectable", or "1 kit · injectable" when the size is not mg.
function describe(v: StoreVariant) {
  return `${v.mg != null ? `${v.mg} mg` : v.size} · ${v.form}`;
}

function toVariant(row: ItemRow): StoreVariant {
  const price = Number(row.price);
  const mg = Number(row.size);
  return {
    id: String(row.id),
    size: row.size,
    mg: Number.isFinite(mg) && mg > 0 ? mg : undefined,
    form: row.form,
    price: price > 0 ? price : undefined,
  };
}

// items rows -> one product per slug, its sizes gathered into `variants`
// (smallest first). The store page shows a product once with its dose dots;
// picking a size happens on the product page. Rows without a slug cannot be
// grouped (there is no product to group under), so each stays its own card.
// Order follows the first row seen, which is the API's name order.
export function toStoreProducts(rows: ItemRow[]): StoreProduct[] {
  const bySlug = new Map<string, StoreProduct>();
  const products: StoreProduct[] = [];
  for (const row of rows) {
    const existing = row.slug ? bySlug.get(row.slug) : undefined;
    if (existing) {
      existing.variants.push(toVariant(row));
      continue;
    }
    const product = toStoreProduct(row);
    if (row.slug) bySlug.set(row.slug, product);
    products.push(product);
  }
  for (const product of products) {
    product.variants.sort((a, b) => (a.mg ?? Infinity) - (b.mg ?? Infinity));
    const priced = product.variants.filter((v) => v.price != null);
    product.price = priced.length
      ? Math.min(...priced.map((v) => v.price as number))
      : undefined;
    // "Injectable" for a product with several sizes; the sizes are the dots.
    product.descriptor =
      product.variants.length > 1
        ? `${product.variants.length} sizes · ${product.variants[0].form}`
        : describe(product.variants[0]);
  }
  return products;
}

// What leads "The latest." right now. Empty array = no promo tile.
export const storePromos: StorePromo[] = [
  {
    eyebrow: "Pre-order 10.28",
    accent: "text-orange-700 dark:text-orange-400 group-data-[tone=dark]/tile:text-orange-400",
    title: "Retatrutide",
    tagline: "More than a little awesome.",
    detail:
      "From $110 or $11/vial for a full kit. Single vials from $14.99/vial for 99% purity, 3rd party tested with Bohemia Upgrade.",
    href: "/shop/retatrutide",
    image: { src: "/store/mito-vial.png", alt: "" },
  },
];

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
