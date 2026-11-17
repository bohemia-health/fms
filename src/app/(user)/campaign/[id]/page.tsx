import { api } from "@/lib/api";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { loginUrl } from "@/lib/auth-site";
import { getSessionUser } from "@/lib/session";
import { CampaignBanner } from "./campaign-banner";
import Image from "next/image";
import AddKitsButton from "@/components/campaign/AddKitsButton";
import { getBagLines } from "@/app/bag/bag";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Group buys are for signed-in people. Signed out goes to the auth site and
  // comes back here.
  if (!(await getSessionUser())) redirect(loginUrl(`/campaign/${id}`));

  // Asclepius checks the visitor's own session on this route, so their cookie
  // goes along with the call.
  const cookie = (await headers()).get("cookie") ?? "";
  const res = await api.campaigns[":id"].$get(
    { param: { id } },
    { headers: { cookie }, init: { cache: "no-store" } },
  );
  if (res.status === 401) redirect(loginUrl(`/campaign/${id}`));
  if (!res.ok) notFound();

  const campaign = await res.json();
  const bagLines = await getBagLines();

  return (
    <main>
      <CampaignBanner
        title={campaign.title}
        status={campaign.status}
        opensAt={campaign.opens_at}
        closesAt={campaign.closes_at}
        artwork={
          id === "510300"
            ? {
                src: "/campaign/great-big-pumpkin.webp",
                alt: "A pumpkin carved with the glowing Bohemia mark",
              }
            : undefined
        }
      />

      <section className="px-4 py-12 flex gap-6 overflow-x-auto bg-background text-foreground">
        {campaign.items.map((item) => (
          <div
            key={item.item_id}
            className="flex min-h-[550px] w-96 shrink-0 flex-col rounded-2xl bg-black text-white"
          >
            <div className="flex flex-col px-6 pt-10 gap-1">
              <h2 className="whitespace-nowrap text-[2.175rem] font-medium leading-tight">
                {item.name} {item.size}mg
              </h2>
              <p className="text-xl">${Number(item.price).toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-center px-6 pt-12">
              <Image
                src="/store/mito-vial.png"
                alt="image of a vial"
                width={100}
                height={100}
                className="h-auto w-[100px] object-contain"
              />
            </div>

            <AddKitsButton
              itemId={item.item_id}
              quantity={bagLines.find((line) => line.itemId === item.item_id)?.quantity ?? 0}
              campaignStatus={campaign.status}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
