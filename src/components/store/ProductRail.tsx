import { container } from "@/lib/layout";
import { Rail, RailItem } from "@/components/rail/Rail";
import ProductCard from "@/components/products/ProductCard";
import StoreHeading from "./StoreHeading";
import type { StoreProduct } from "./types";

// One store section: anchor, heading, and a horizontal rail of product cards.
// scroll-mt-12 keeps the heading clear of the sticky LocalNav on anchor jumps.
export default function ProductRail({
  id,
  lead,
  rest,
  products,
}: {
  id: string;
  lead: string;
  rest: string;
  products: StoreProduct[];
}) {
  return (
    <section id={id} className="scroll-mt-12 py-8 md:py-12">
      <div className={container}>
        <StoreHeading lead={lead} rest={rest} className="mb-6 md:mb-8" />
      </div>
      <Rail label={`${lead} products`}>
        {products.map((product) => (
          <RailItem key={product.id} className="w-[260px] md:w-[300px]">
            <ProductCard product={product} className="h-full" />
          </RailItem>
        ))}
      </Rail>
    </section>
  );
}
