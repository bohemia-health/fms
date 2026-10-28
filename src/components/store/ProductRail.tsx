import { Rail, RailItem } from "@/components/rail/Rail";
import ProductCard from "@/components/products/ProductCard";
import StoreHeading from "./StoreHeading";
import { storeColumn, type StoreProduct } from "./types";

// One store section: anchor, heading, and a horizontal rail of product cards.
// `leading` and `trailing` are extra card-sized tiles for the front and back
// of the row (a pre-order promo, a "see the lab reports" closer).
// scroll-mt-12 keeps the heading clear of the sticky LocalNav on anchor jumps.
export default function ProductRail({
  id,
  lead,
  rest,
  products,
  leading,
  trailing,
}: {
  id: string;
  lead: string;
  rest: string;
  products: StoreProduct[];
  /** One tile or several for the front of the row. */
  leading?: React.ReactNode | React.ReactNode[];
  trailing?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-12 py-8 md:py-12">
      <div className={storeColumn}>
        <StoreHeading lead={lead} rest={rest} className="mb-6 md:mb-8" />
      </div>
      <Rail label={`${lead} products`}>
        {(Array.isArray(leading) ? leading : leading ? [leading] : []).map(
          (tile, i) => (
            <RailItem key={i}>{tile}</RailItem>
          ),
        )}
        {products.map((product) => (
          <RailItem key={product.id}>
            <ProductCard product={product} />
          </RailItem>
        ))}
        {trailing && <RailItem>{trailing}</RailItem>}
      </Rail>
    </section>
  );
}
