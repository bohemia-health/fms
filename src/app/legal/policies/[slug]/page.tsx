import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { api } from "@/lib/api";

import styles from "./policy.module.css";
import { SetBreadcrumb, SetLocalNav, SetNavbar } from "@asclepius/ui";
import { Tile, TileHeader } from "@/components/tile";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await api.policies[":slug"].$get({ param: { slug } });
  if (!res.ok) notFound();
  const { title, body } = await res.json();

  return (
    <main className={styles.page}>
      <Tile className="py-24 md:py-56">
        <TileHeader className="text-3xl md:text-5xl font-semibold transition-all">
          {title}
        </TileHeader>
      </Tile>
      <article className={styles.policy}>
        <ReactMarkdown>{body}</ReactMarkdown>
      </article>
      <SetNavbar sticky={false} />
      <SetLocalNav
        sticky
        title={"Legal"}
        titleClassName="tracking-tight"
        border="full"
        href="/legal"
        links={[]}
      />

      <SetBreadcrumb
        items={[
          { label: "Legal", href: "/legal" },
          { label: "Policies" },
          { label: title },
        ]}
      />
    </main>
  );
}
