import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { StoreProduct } from "@/components/store/types";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Store product card. The whole card is the link. Image on top, the line
// name as an eyebrow, title, one-line descriptor, price at the bottom.
// Shadow carries the edge in light mode; a hairline ring does in dark.
export default function ProductCard({
  product,
  className,
}: {
  product: StoreProduct;
  className?: string;
}) {
  const { title, descriptor, price, href, line } = product;
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group/card flex flex-col rounded-[18px] bg-card text-card-foreground",
        "shadow-[2px_4px_12px_rgba(0,0,0,0.08)] dark:shadow-none dark:ring-1 dark:ring-foreground/10",
        "transition-[transform,box-shadow] duration-200 ease-out",
        "hover:scale-[1.01] hover:shadow-[2px_4px_16px_rgba(0,0,0,0.16)] active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0065CC]",
        className,
      )}
    >
      <div className="relative mx-8 mt-8 aspect-square">
        {line && (
          <Image
            src={line.image.src}
            alt={line.image.alt}
            fill
            sizes="300px"
            className={cn("object-contain", line.image.className)}
          />
        )}
      </div>

      <div className="px-5 pt-7 md:px-7">
        {line && (
          <p className="text-xs font-light text-indigo-500">{line.label}</p>
        )}
        <h3 className="mt-1.5 line-clamp-2 text-[17px] font-medium leading-snug tracking-[0.01em]">
          {title}
        </h3>
        {descriptor && (
          <p className="mt-1 line-clamp-1 text-[13px] font-light text-muted-foreground">
            {descriptor}
          </p>
        )}
      </div>

      <div className="mt-auto px-5 pb-7 pt-5 md:px-7">
        <p className="text-[14px] font-light tracking-wide">
          {price != null ? (
            money.format(price)
          ) : (
            <span className="text-[#0065CC]">View pricing</span>
          )}
        </p>
      </div>
    </Link>
  );
}
