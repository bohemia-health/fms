import { db } from "@/index";
import { productsTable } from "@/db";
import ProductCard from "@/components/products/ProductCard";
import SetBreadcrumb from "@/components/footer/breadcrumb/SetBreadcrumb";
import { container } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default async function ShopPage() {
  const products = await db
    .select({
      productId: productsTable.id,
      image: productsTable.image,
      title: productsTable.title,
      url: productsTable.url,
    })
    .from(productsTable);

  return (
    <main className={cn(container, "mt-10 mb-12 md:mt-24")}>
      <div className="flex flex-col gap-3 pb-10 md:flex-row md:items-end md:gap-10 md:pb-16">
        <h1 className="text-5xl font-medium leading-none md:text-7xl">Store</h1>
        <p className="max-w-xs text-xl leading-tight text-muted-foreground md:pl-6 md:-indent-6 md:text-2xl">
          The best way to buy the products you love
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.productId} title={p.title} />
        ))}
      </div>
      <SetBreadcrumb items={[{ label: "Store" }]} />
    </main>
  );
}
