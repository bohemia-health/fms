import { notFound, redirect } from "next/navigation";
import { repositoryGoto } from "@/app/shop/goto/targets";

// /repository/goto/<key>: a redirect, nothing rendered. The store header's
// "Find a Lab Report" points here.
export default async function RepositoryGoto({
  params,
}: {
  params: Promise<{ key: string[] }>;
}) {
  const { key } = await params;
  const target = repositoryGoto[key.join("/")];
  if (!target) notFound();
  redirect(target);
}
