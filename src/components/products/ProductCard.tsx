import DoseSwatches from "@/components/store/DoseSwatches";
import { dosesFrom } from "@/components/store/doses";
import {
  StoreTile,
  TileBody,
  TileDetail,
  TileEyebrow,
  TileImage,
  TileTitle,
} from "@/components/store/StoreTile";
import type { StoreProduct } from "@/components/store/types";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// A product in a store rail: the StoreTile with the line as its eyebrow, the
// product as its title, the price and sizes as the detail line, and the
// line's cut-out below. Dose dots sit under the detail only when there is a
// size to choose; a size is chosen on the product page, so here they only
// say what exists.
export default function ProductCard({
  product,
  className,
}: {
  product: StoreProduct;
  className?: string;
}) {
  const { title, descriptor, price, href, line, variants } = product;
  const several = variants.length > 1;
  const doses = several ? dosesFrom(variants) : [];

  return (
    <StoreTile href={href} className={className}>
      <TileBody>
        {line && (
          <TileEyebrow className="text-indigo-500 group-data-[tone=dark]/tile:text-indigo-300">
            {line.label}
          </TileEyebrow>
        )}
        <TileTitle>{title}</TileTitle>
        <TileDetail>
          {price != null ? (
            <>
              {several ? "From " : ""}
              {money.format(price)}
            </>
          ) : (
            <span className="text-[#0065CC]">View pricing</span>
          )}
          {descriptor && (
            <span className="text-muted-foreground"> · {descriptor}</span>
          )}
        </TileDetail>
        {doses.length > 0 && (
          <DoseSwatches doses={doses} size="sm" className="mt-4" />
        )}
      </TileBody>
      {line && (
        <TileImage
          src={line.image.src}
          alt={line.image.alt}
          imageClassName={line.image.className}
        />
      )}
    </StoreTile>
  );
}
