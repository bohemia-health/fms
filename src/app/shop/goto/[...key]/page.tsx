import { notFound, redirect } from "next/navigation";
import { shopGoto } from "../targets";

// /shop/goto/<key>: a redirect, nothing rendered. Catch-all so keys can
// have a slash in them ("business/faq").
export default async function ShopGoto({
  params,
}: {
  params: Promise<{ key: string[] }>;
}) {
  const { key } = await params;
  const target = shopGoto[key.join("/")];
  if (!target) notFound();
  redirect(target);
}
