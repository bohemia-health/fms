import { db } from "@/index";
import { productsTable } from "@/db";

export default async function ShopPage() {
  const products = await db
    .select({
      productId: productsTable.id,
      image: productsTable.image,
      title: productsTable.title,
      url: productsTable.url,
    })
    .from(productsTable);

  return <h1>Hello world!</h1>;
}
