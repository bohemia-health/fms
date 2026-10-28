import type { StoreVariant } from "./types";

export type Dose = {
  /** The item id: the React key, since two sizes can parse to the same mg. */
  id: string;
  mg: number;
  price?: number;
};

// Product variants -> doses for the dots. Sizes that are not a number of mg
// ("1 kit") have no dot; the card falls back to its descriptor. Plain module,
// no "use client", so server components can call it before rendering the dots.
export function dosesFrom(variants: StoreVariant[]): Dose[] {
  return variants
    .filter((v): v is StoreVariant & { mg: number } => v.mg != null)
    .map((v) => ({ id: v.id, mg: v.mg, price: v.price }));
}
