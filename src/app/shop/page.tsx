import { db } from "@/index";
import { productsTable } from "@/db";
import ProductCard from "@/components/products/ProductCard";

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
    <main className="mt-24 mb-12 px-32">
      <div className="flex flex-row items-end gap-10 pb-16">
        <h1 className="text-7xl font-medium leading-none">Store</h1>
        <h3 className="max-w-xs pl-6 -indent-6 text-2xl leading-tight text-muted-foreground">
          The best way to buy the products you love
        </h3>
      </div>
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.productId} title={p.title} />
        ))}
      </div>
    </main>
  );
}
