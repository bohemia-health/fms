import { Button } from "@/components/ui/button";
import { itemTable } from "@/db";
import { db } from "@/index";

interface PageProps {
  params: Promise<{ id: string }>;
}
{
  /* Started on Product Page: To-Do */
}
export default async function Item({ params }: PageProps) {
  const { id } = await params;
  const [item] = await db
    .select({
      item_id: itemTable.id,
      item_name: itemTable.name,
      price: itemTable.price,
    })
    .from(itemTable);

  return (
    <main>
      <h1>{item.item_id}</h1>
      <h2>{item.item_name}</h2>
      <h3>{item.price}</h3>
      <Button size="sm">Add to Cart</Button>
    </main>
  );
}
