// The buy flow's option data and types. A plain module, not "use client":
// a server component (the product page) can only read *values* from a
// server-safe module; exports of a client module reach it as references.
export const configOptions = [
  {
    id: "size",
    title: "Concentration. Choose your vial.",
  },

  {
    id: "vendor",
    title: "Vendor. Pick your favorite.",
  },

  {
    id: "quantity",
    title: "Quantity. Take as many as you like.",
  },
];

export const PRODUCT_OPTIONS_CONFIG = [
  {
    id: "size",
    title: "Concentration. Choose your vial.",
    type: "radio",
    choices: [
      { label: "20mg", price: "Buy from $1299 or $108.25/mo. for 12mo.*" },
      { label: "30mg", price: "$190" },
      { label: "40mg", price: "$235" },
      { label: "60mg", price: "$320" },
    ],
  },

  {
    id: "quantity",
    title: "Quantity. Take as many as you like.",
    type: "radio",
    choices: ["Single Vial", "Full Kit"],
  },

  {
    id: "vendor",
    title: "Vendor. Pick your favorite.",
    type: "radio",
    choices: ["Uther", "Changsha", "WWB", "Biochem"],
  },
];

/** A choice is a bare label, or a label with the price shown on the card's right. */
export type Choice =
  | string
  | {
      label: string;
      price?: string;
      /** true = greyed out and not selectable (no stock for this combination). */
      disabled?: boolean;
      /** One quiet line under the label, e.g. "Not available from Uther". */
      note?: string;
    };

export type ProductOption = {
  id: string;
  title: string;
  type: string;
  choices: Choice[];
};

export const toChoice = (c: Choice) =>
  typeof c === "string" ? { label: c } : c;
