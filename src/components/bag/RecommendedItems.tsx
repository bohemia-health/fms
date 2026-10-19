import { container } from "@/lib/layout";
import { cn } from "@/lib/utils";
import RecommendedItem from "./RecommendedItem";
import type { StoreProduct } from "@/components/store/types";

// The grid of picks for the bag page's "You may also like" section: two
// across on phones, four on desktop. The section and heading around it live
// in the page. Renders nothing when there is nothing left to recommend.
export default function RecommendedItems({
  products,
}: {
  products: StoreProduct[];
}) {
  if (products.length === 0) return null;

  return (
    <ul
      className={cn(
        container,
        "mt-10 grid grid-cols-2 gap-x-6 gap-y-12 text-left md:grid-cols-4 md:gap-x-10",
      )}
    >
      {products.map((product) => (
        <li key={product.id}>
          <RecommendedItem product={product} />
        </li>
      ))}
    </ul>
  );
}
