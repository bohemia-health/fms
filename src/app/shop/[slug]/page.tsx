import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { container } from "@asclepius/ui";
import { cn } from "@/lib/utils";
import AddToBagButton from "@/components/bag/AddToBagButton";
import { SetBreadcrumb } from "@asclepius/ui";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Product page. One item_codes row is the product; its items rows are the
// size variants. Skeletal for now: title, the variants, a dead Add to Bag.
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const res = await api.products[":slug"].$get({ param: { slug } });
  if (!res.ok) notFound();
  const product = await res.json();

  return (
    <main className={cn(container, "py-16 md:py-24")}>
      <SetBreadcrumb
        items={[{ label: "Store", href: "/shop" }, { label: product.title }]}
      />
      <p className="text-xs font-light text-muted-foreground">{product.code}</p>
      <h1 className="mt-1 text-4xl font-medium tracking-tight md:text-5xl">
        {product.title}
      </h1>

      <h2 className="mt-12 text-sm font-medium">Size</h2>
      {product.variants.length === 0 ? (
        <p className="mt-2 text-sm font-light text-muted-foreground">
          No sizes listed yet.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col divide-y divide-foreground/10 border-y border-foreground/10">
          {product.variants.map((v) => {
            const price = Number(v.price);
            return (
              <li
                key={v.id}
                className="flex items-center justify-between gap-6 py-4"
              >
                <div>
                  <p className="text-[17px] font-medium">{v.size}</p>
                  <p className="text-[13px] font-light text-muted-foreground">
                    {v.form}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-[14px] font-light tracking-wide">
                    {price > 0 ? (
                      money.format(price)
                    ) : (
                      <span className="text-[#0065CC]">View pricing</span>
                    )}
                  </p>
                  <AddToBagButton itemId={v.id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
