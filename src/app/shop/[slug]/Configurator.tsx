"use client";

import { useMemo, useState } from "react";
import { ConfigStep } from "./ConfigStep";
import ProductOptions from "@/components/products/ProductOptions";
import { PRODUCT_OPTIONS_CONFIG } from "@/components/products/options";
import AddToBagButton from "@/components/bag/AddToBagButton";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import type { StoreVariant } from "@/components/store/types";

/** One row per batch x lab report from the availability route, plus the report link. */
export type Stock = {
  itemId: string;
  size: string;
  vendorId: number;
  vendor: string | null;
  vendorFullName: string;
  batchId: number;
  batchNumber: string;
  quantity: number | null;
  coaKey: string | null;
  coaTitle: string | null;
  coaUrl: string | null;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const sizeLabel = (v: StoreVariant) => (v.mg ? `${v.mg} mg` : v.size);
const vendorLabel = (m: Stock) => m.vendor ?? m.vendorFullName;

/**
 * The buy flow's right column: Size, Vendor and Quantity as one piece of
 * state, so each step can grey out what the others rule out, then the
 * price and Add to Bag for the item that selection names.
 *
 * Availability comes from the API's stock rows (one per item x vendor with
 * stock). A size is unavailable when no vendor stocks it; a vendor is
 * unavailable for the chosen size. Quantity cannot be judged yet: nothing
 * records whether a batch sells single vials or only kits.
 */
export default function Configurator({
  variants,
  stock,
  children,
}: {
  variants: StoreVariant[];
  stock: Stock[];
  /** Rendered inside the last step, under Add to Bag (the trust lines). */
  children?: React.ReactNode;
}) {
  // No rows at all means we have no stock data for this product (batches
  // not yet linked to items), not that it is sold out: grey nothing, and
  // show the configured vendor list instead of an empty step.
  const known = stock.length > 0;
  const vendors = useMemo(() => {
    const seen = new Map<number, Stock>();
    for (const s of stock) if (!seen.has(s.vendorId)) seen.set(s.vendorId, s);
    return [...seen.values()];
  }, [stock]);
  const stocks = (v: StoreVariant | undefined, vendorId?: number) =>
    !known ||
    stock.some(
      (s) =>
        s.itemId === v?.id &&
        (vendorId === undefined || s.vendorId === vendorId),
    );

  const [sizeIdx, setSizeIdx] = useState(() =>
    Math.max(
      0,
      variants.findIndex((v) => stocks(v)),
    ),
  );
  const variant = variants[sizeIdx];
  const [vendorId, setVendorId] = useState<number | undefined>(
    () => vendors.find((m) => stocks(variants[sizeIdx], m.vendorId))?.vendorId,
  );
  const quantityConfig = PRODUCT_OPTIONS_CONFIG.find(
    (o) => o.id === "quantity",
  );
  const vendorConfig = PRODUCT_OPTIONS_CONFIG.find((o) => o.id === "vendor");
  const [fallbackVendor, setFallbackVendor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<string | undefined>(undefined);

  const chooseSize = (label: string) => {
    const i = variants.findIndex((v) => sizeLabel(v) === label);
    if (i < 0) return;
    setSizeIdx(i);
    // Keep the vendor if it stocks the new size, else the first that does.
    if (!stocks(variants[i], vendorId)) {
      setVendorId(
        vendors.find((m) => stocks(variants[i], m.vendorId))?.vendorId,
      );
    }
  };

  const sizeChoices = variants.map((v) => ({
    label: sizeLabel(v),
    price: v.price !== undefined ? money.format(v.price) : undefined,
    disabled: !stocks(v),
    note: stocks(v) ? undefined : "Not in stock",
  }));
  const vendorChoices = vendors.map((m) => {
    const ok = stocks(variant, m.vendorId);
    return {
      label: vendorLabel(m),
      disabled: !ok,
      note: ok
        ? undefined
        : `No ${variant ? sizeLabel(variant) : "stock"} from ${vendorLabel(m)}`,
    };
  });
  const chosenVendor = vendors.find((m) => m.vendorId === vendorId);
  // The batch this selection ships from: the fullest one for the chosen
  // size and vendor. Its reports are every row that names that batch.
  const batchRows = stock.filter(
    (s) => s.itemId === variant?.id && s.vendorId === vendorId,
  );
  const chosenBatch = batchRows.reduce<Stock | undefined>(
    (best, s) => (!best || (s.quantity ?? 0) > (best.quantity ?? 0) ? s : best),
    undefined,
  );
  const reports = chosenBatch
    ? batchRows.filter((s) => s.batchId === chosenBatch.batchId && s.coaUrl)
    : [];

  return (
    <>
      <ConfigStep id="size" title="Size." lead="Choose your vial.">
        <ProductOptions
          choices={sizeChoices}
          value={variant ? sizeLabel(variant) : undefined}
          onChange={chooseSize}
        />
      </ConfigStep>

      <ConfigStep id="vendor" title="Vendor." lead="Pick your favorite.">
        {known ? (
          <ProductOptions
            choices={vendorChoices}
            value={chosenVendor ? vendorLabel(chosenVendor) : undefined}
            onChange={(label) =>
              setVendorId(
                vendors.find((m) => vendorLabel(m) === label)?.vendorId,
              )
            }
          />
        ) : vendorConfig ? (
          <ProductOptions
            choices={vendorConfig.choices}
            value={fallbackVendor}
            onChange={setFallbackVendor}
          />
        ) : null}
      </ConfigStep>

      {quantityConfig && (
        <ConfigStep
          id="quantity"
          title={quantityConfig.title.split(". ")[0] + "."}
          lead={quantityConfig.title.split(". ").slice(1).join(". ")}
        >
          <ProductOptions
            choices={quantityConfig.choices}
            value={quantity}
            onChange={setQuantity}
          />
        </ConfigStep>
      )}

      <ConfigStep id="bag" title="Add to bag." lead="Your selection.">
        {variant && (
          <>
            <p className="text-[14px] font-light text-muted-foreground">
              {sizeLabel(variant)}
              {chosenVendor
                ? ` · ${chosenVendor.vendorFullName}`
                : fallbackVendor && ` · ${fallbackVendor}`}
              {quantity && ` · ${quantity}`}
            </p>
            {chosenBatch && (
              <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[14px] font-light text-muted-foreground">
                <span>Batch {chosenBatch.batchNumber}</span>
                {reports.map((r) => (
                  <a
                    key={r.coaKey}
                    href={r.coaUrl ?? undefined}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-0.5 text-[#0065CC] hover:underline"
                  >
                    View lab report
                    <ArrowUpRight className="size-4" />
                  </a>
                ))}
              </p>
            )}
            <p className="mt-2 text-[28px] font-medium tracking-tight tabular-nums">
              {variant.price !== undefined ? (
                money.format(variant.price)
              ) : (
                <span className="text-[20px] text-[#0065CC]">View pricing</span>
              )}
            </p>
            <AddToBagButton
              itemId={variant.id}
              pill
              className="mt-5 max-w-xs"
            />
          </>
        )}
        {children}
      </ConfigStep>
    </>
  );
}
