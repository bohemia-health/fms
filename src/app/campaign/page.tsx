import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { SetFootnotes } from "@asclepius/ui";
import {
  Tile,
  TileHeader,
  TileTitle,
  TileTagline,
  TileActions,
  TileImage,
} from "@/components/tile";
import { container } from "@asclepius/ui";
import { Rail, RailCaption, RailItem } from "@/components/rail/Rail";
import { SetBreadcrumb } from "@asclepius/ui";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { Separator } from "@base-ui/react";
import { Card } from "@/components/ui/card";
import { storeColumn } from "@/components/store/types";

// apple.com/iphone hero gallery: 1260x680 cards centered, 80px gutters once the
// column no longer fits, 16px on phones. Corner radius is Apple's 28px at full
// width and scales down with the card (28/1260 = 2.22%) to a 16px floor: Apple
// keeps 28px on phones because their phone cards are 308x480 portrait, while
// ours keep the 1260/680 aspect and are only 185px tall there. vw rather than
// cqw because the card is its own @container and cqw on the container itself
// would resolve against an ancestor.
const railGutter =
  "px-[max(1rem,calc((100%-1260px)/2))] md:px-[max(5rem,calc((100%-1260px)/2))]";
// Bands that stay white in dark mode: the announced gallery, the open group
// buys and the FAQ. Besides the background, the tokens their children paint
// with (text, the light card, muted text, borders, the chevrons' foreground
// tint) are pinned to the light values from @asclepius/ui tokens.css, so a
// dark card stays dark and a light one stays light either way.
const lightBand =
  "bg-white text-foreground [--foreground:oklch(0.145_0_0)] [--card:oklch(1_0_0)] [--card-foreground:oklch(0.145_0_0)] [--muted-foreground:oklch(0.556_0_0)] [--border:oklch(0.922_0_0)]";
// Completed group buys that have no render yet: a quiet near-black card with
// a small partner line top-left and title + "Completed" bottom-left in the
// WWB card's type, so every completed buy reads as one family. Insets and
// floors match the OUPeptide card. Text sits in a RailCaption for the
// parallax. When a render lands for one of these, give it its own article
// like the WWB card and drop this call.
function CompletedCard({ partner, title }: { partner: string; title: string }) {
  return (
    <article className="@container relative aspect-[1260/680] w-[1260px] max-w-full shrink-0 snap-start overflow-clip rounded-[clamp(16px,2.22vw,28px)] bg-[radial-gradient(90%_70%_at_50%_110%,#1C1C21_0%,#09090B_100%)]">
      <RailCaption className="absolute inset-0">
        <p className="absolute left-[clamp(16px,5.4cqw,68px)] top-[clamp(16px,5.4cqw,68px)] text-[clamp(11px,1.5cqw,19px)] font-medium uppercase leading-none tracking-[0.08em] text-neutral-400">
          {partner}
        </p>
        <div className="absolute bottom-[clamp(16px,5.4cqw,68px)] left-[clamp(16px,5.4cqw,68px)]">
          <p className="text-[clamp(28px,4.44cqw,56px)] font-semibold leading-[1.07] tracking-[-0.005em] text-white">
            {title}
          </p>
          <p className="mt-[0.2em] text-[clamp(17px,2.22cqw,28px)] font-normal leading-[1.14] text-neutral-400">
            Completed
          </p>
        </div>
      </RailCaption>
    </article>
  );
}

export default function Page() {
  return (
    <main>
      {/* New October GB Announcement */}
      <Tile theme="pumpkin">
        <TileHeader>
          <TileTitle className="justify-start font-semibold uppercase bg-[linear-gradient(90deg,#AAA_0%,#D9D9D9_45.67%,#A7A8A8_100%)] bg-clip-text group-data-[theme=pumpkin]/tile:text-transparent">
            Great Big Pumpkin Group Buy
          </TileTitle>
          <TileTagline className="font-normal text-[#EAEAEA]">
            Available starting 10.23
          </TileTagline>
        </TileHeader>

        <TileActions>
          <Button variant="normal" className="font-normal">
            Learn more
          </Button>
          <Button
            variant="normal"
            className="bg-transparent text-[#2797FF] border-[#2797FF] hover:bg-transparent"
          >
            Pre-order
          </Button>
        </TileActions>

        <div className="relative mt-8">
          <TileImage
            src="/campaign/pumpkin_asset.webp"
            alt="A carved pumpkin glowing with the Bohemia mark"
            width={1024}
            height={1024}
            className="pt-0"
            priority
          />
        </div>
      </Tile>

      {/* White in both modes, like Apple's gallery band. The heading and the
          dots pill paint with the theme's foreground, so the light value is
          pinned here; otherwise dark mode would put white dots on white. */}
      <section className={cn(lightBand, "py-16")}>
        <h1
          className={cn(
            railGutter,
            "mb-8 text-center text-2xl font-semibold leading-snug md:text-5xl",
          )}
        >
          Here&rsquo;s what we&rsquo;ve announced.
        </h1>
        <Rail
          label="Past group buys"
          nav="dots"
          // No gutter override: the Rail's own store gutter puts the first
          // card on the 1520px column's text edge, where Open Group Buys
          // starts, so the two sections share a left edge at every width.
          className="gap-5"
        >
          {/* TFC x Bohemia, "A new frequency." Figma frame is 2203x1410
              (1.56:1): logomark 690px wide at 12% from the top, headline 128px
              Inter medium, date 48px violet-50 at 80%, footer 36px uppercase.
              Our card is 1.85:1, so vertical positions keep the frame's
              fractions of height (logomark 13%..59%, headline centred at
              69.5%, date 79.6%, footer 90%) and the type scales with card
              width a little under the frame's ratio so the shorter card does
              not crowd. The headline gradient is read off the render: white
              on "A new", periwinkle by the full stop. */}
          <article className="@container relative aspect-[1260/680] w-[1260px] max-w-full shrink-0 snap-start overflow-clip rounded-[clamp(16px,2.22vw,28px)] bg-black">
            <div className="absolute left-1/2 top-[13%] aspect-[690/655] h-[46%] -translate-x-1/2">
              <Image
                src="/campaign/holographic_logomark.png"
                alt="The Bohemia mark rendered as a holographic blue and violet glass form"
                fill
                sizes="(min-width: 1420px) 330px, 26vw"
                quality={100}
                className="object-contain"
              />
            </div>

            <RailCaption className="pointer-events-none absolute inset-0 text-center">
              <p className="absolute left-0 right-0 top-[69.5%] -translate-y-1/2 text-[clamp(20px,5.3cqw,67px)] font-medium leading-none tracking-[-0.02em] bg-[linear-gradient(90deg,#FFF_0%,#E4ECFF_40%,#7BA4FF_100%)] bg-clip-text text-transparent">
                A new frequency.
              </p>
              <p className="absolute left-0 right-0 top-[79.6%] -translate-y-1/2 text-[clamp(12px,2cqw,25px)] font-medium leading-none text-[#F5F3FF]/80">
                10.2025
              </p>
              <p className="absolute left-0 right-0 top-[90%] -translate-y-1/2 text-[clamp(11px,1.5cqw,19px)] font-medium uppercase leading-none text-[#F5F3FF]">
                TFC x Bohemia
              </p>
            </RailCaption>
          </article>

          {/* OUPeptide November. Assets: /campaign/november/bg-img.png is the
              gradient with the Bohemia mark watermark; /campaign/MAPLELEAF.png
              is the leaf with the mark already cut out and the hand holding
              it, on transparency, so the watermark shows through the hole.
              Reference frame is 2000x1280: the leaf PNG sits at 95% of the
              frame height, bottom edge flush with the card (the hand runs off
              the bottom), centred, which puts the leaf's top at 14%. Type is
              inset ~5.4% of width on every side (108px of 2000; 69px of 680 tall is
              the same at this card's height). Apple-event treatment: OUPeptide is
              the semibold headline, tight tracking, in the same silver gradient
              as the featured tile's title; year and month are the secondary
              line in Apple's dark-mode secondary grey (#A1A1A6) at ~63% of the
              headline size. Floors keep phones at the rail's smallest type. */}
          <article className="@container relative aspect-[1260/680] w-[1260px] max-w-full shrink-0 snap-start overflow-clip rounded-[clamp(16px,2.22vw,28px)] bg-[#0F0F0F]">
            <Image
              src="/campaign/november/bg-img.png"
              alt=""
              fill
              sizes="(min-width: 1420px) 1260px, 100vw"
              quality={100}
              priority
              className="object-cover"
            />

            <div className="absolute bottom-0 left-1/2 aspect-[1800/1350] h-[95%] -translate-x-1/2">
              <Image
                src="/campaign/MAPLELEAF.png"
                alt="A hand holding up a red maple leaf with the Bohemia mark cut out of it"
                fill
                sizes="(min-width: 1420px) 862px, 68vw"
                quality={100}
                priority
                className="object-contain object-bottom"
              />
            </div>

            <RailCaption className="pointer-events-none absolute inset-0">
              <p className="absolute left-[clamp(16px,5.4cqw,68px)] top-[clamp(16px,5.4cqw,68px)] text-[clamp(15px,2.4cqw,30px)] font-normal leading-none tracking-[-0.005em] text-[#A1A1A6]">
                2025
              </p>
              <p className="absolute bottom-[clamp(16px,5.4cqw,68px)] left-[clamp(16px,5.4cqw,68px)] text-[clamp(21px,3.8cqw,48px)] font-semibold leading-none tracking-[-0.025em] bg-[linear-gradient(90deg,#AAA_0%,#D9D9D9_45.67%,#A7A8A8_100%)] bg-clip-text text-transparent">
                OUPeptide
              </p>
              <p className="absolute bottom-[clamp(16px,5.4cqw,68px)] right-[clamp(16px,5.4cqw,68px)] text-[clamp(15px,2.4cqw,30px)] font-normal leading-none tracking-[-0.005em] text-[#A1A1A6]">
                November
              </p>
            </RailCaption>
          </article>

          <CompletedCard partner="Uther x Bohemia" title="Uther Group Buy" />

          {/* Dark card. The render is wider than the card so the pipette, which
              is centered in the image, lands right of center and clear of the
              title; the card adds only the type. */}
          <article className="@container relative aspect-[1260/680] w-[1260px] max-w-full shrink-0 snap-start overflow-clip rounded-[clamp(16px,2.22vw,28px)] bg-[#3A3A3C]">
            <Image
              src="/campaign/pipette-quiet.webp"
              alt="A single micropipette standing in its stand on a charcoal background"
              width={1536}
              height={1024}
              className="absolute left-0 top-[-19%] h-auto w-[112%] max-w-none"
            />

            <RailCaption className="absolute left-[4.3%] top-[7.6%]">
              <p className="text-[clamp(28px,4.44cqw,56px)] font-semibold leading-[1.07] tracking-[-0.005em] text-white">
                WWB Bioregulator
              </p>
              <p className="mt-[0.2em] text-[clamp(17px,2.22cqw,28px)] font-normal leading-[1.14] text-neutral-400">
                Completed
              </p>
            </RailCaption>
          </article>

          <CompletedCard
            partner="Uther x Lobster x Bohemia"
            title="LobsterFest"
          />
          <CompletedCard partner="WWB x Bohemia" title="WWB MITO Group Buy" />
          <CompletedCard partner="Uther x Bohemia" title="Cartalaxmania" />
          <CompletedCard
            partner="Adalank · Adamax"
            title="Nootropic Group Buy"
          />
        </Rail>
      </section>

      {/* Apple store rail: heading on the 1520px store column, cards at the
          feature-tile width starting on the column's text edge and running
          off the right, instead of a grid stretched to the column. */}
      <section className={cn(lightBand, "pt-8 pb-16 md:pt-12 md:pb-20")}>
        <div className={storeColumn}>
          <h1 className="text-5xl font-semibold mb-12">Open Group Buys</h1>
        </div>
        <Rail label="Open group buys">
          <RailItem>
            <Card className="relative h-full w-[320px] shrink-0 md:w-[480px] px-6 pt-8 bg-foreground text-white ring-white/10 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] transition-[scale,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.01] hover:shadow-[2px_4px_16px_rgba(0,0,0,0.16)]">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-orange-500">NEW</label>
                <div className="flex flex-col gap-0">
                  <h1 className="text-[1.65rem] font-semibold">
                    Great Big Pumpkin Group Buy
                  </h1>
                  <p className="text-[14px]">
                    Pre-Order until 11.12 Central Standard Time
                  </p>
                </div>
              </div>

              <div className="relative mt-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-radial-[60%_60%_at_50%_60%] from-orange-500/35 to-transparent to-70%"
                />
                <Image
                  src="/campaign/pumpkin_asset.webp"
                  alt="campaign image"
                  width={1024}
                  height={1024}
                  className="relative drop-shadow-[0_24px_28px_rgba(0,0,0,0.55)]"
                  priority
                />
              </div>
            </Card>
          </RailItem>
          <RailItem>
            <Card className="relative h-full w-[320px] shrink-0 md:w-[480px] px-6 pt-8 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] transition-[scale,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.01] hover:shadow-[2px_4px_16px_rgba(0,0,0,0.16)]">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-purple-700">
                  UPCOMING
                </label>
                <div className="flex flex-col gap-0">
                  <h1 className="text-3xl font-semibold max-w-sm leading-tighter">
                    Immune Modulation Group Buy
                  </h1>
                  <p className="text-[14px]">
                    Pre-Order 11.25 Central Standard Time
                  </p>
                </div>
              </div>

              <div className="relative mt-auto w-84 mx-auto">
                <Image
                  src="/molecule3Demoji.png"
                  alt="campaign image"
                  width={1024}
                  height={1024}
                  quality={100}
                  className="relative drop-shadow-[0_20px_24px_rgba(0,0,0,0.22)]"
                  priority
                />
              </div>
            </Card>
          </RailItem>
        </Rail>
      </section>

      <section className={cn(lightBand, "border-t border-muted-foreground/60")}>
        <div className={container}>
          <Accordion defaultValue={["item-1"]} className="py-8 bg-white">
            <AccordionItem>
              <AccordionTrigger className="mx-3 text-black text-3xl font-medium hover:no-underline">
                Questions about Campaigns
              </AccordionTrigger>

              <AccordionContent className="mx-3 py-4">
                <Separator
                  orientation="horizontal"
                  className="h-[1px] w-full bg-muted-foreground/20"
                />
                <Accordion>
                  <AccordionItem>
                    <AccordionTrigger className="text-lg hover:no-underline">
                      What is a group buy?
                    </AccordionTrigger>
                    <AccordionContent>
                      A campaign or group buy is a bulk order facilitated by
                      Bohemia Health through a vendor.{" "}
                      <span>
                        <Link
                          href="/policy/qualifying-customer"
                          className="text-[#0065CC] !no-underline hover:no-underline hover:!text-[#0065CC]"
                        >
                          Qualifying customers
                        </Link>
                      </span>{" "}
                      participate in a campaign by following the guide and
                      placing a pre-order on bhmhlth.com. Bohemia facilitates
                      the bulk order from placing it with the vendor to shipping
                      samples to the recipients.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionTrigger className="text-lg hover:no-underline">
                      When will I get my Items?
                    </AccordionTrigger>

                    <AccordionContent>
                      By entering a zip code at checkout, you&rsquo;ll get
                      estimated delivery dates for your items. You&rsquo;ll
                      receive a final delivery date once all of your items
                      arrive. Delivery estimates are based on item availability,
                      testing requirements, lab processing speeds and the
                      shipping option you choose.{" "}
                      <span>
                        <Link
                          href="/policies/shipping"
                          className="inline-flex items-center gap-0 text-[#0065CC] !no-underline hover:!no-underline hover:!text-[#0065CC]"
                        >
                          Learn more about Shipping
                          <ArrowUpRight className="size-6" />
                        </Link>
                      </span>{" "}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionTrigger className="text-lg hover:no-underline">
                      What are my payment options?
                    </AccordionTrigger>

                    <AccordionContent className="text-sm leading-wide">
                      We accept USDT, USDC on Solana and ERC-20, most credit and
                      debit cards, Venmo, Zelle, Wise, and Store Gift Cards —
                      though Venmo, Zelle, Wise, Store Gift Cards, and other
                      payment options may not be available for all products. You
                      can contact{" "}
                      <Link
                        href="/support"
                        className="inline-flex items-center gap-0 text-[#0065CC] !no-underline hover:!no-underline hover:!text-[#0065CC]"
                      >
                        support
                      </Link>{" "}
                      for more information.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <SetFootnotes
        notes={[
          "The information provided on this site is for general informational and educational purposes only.",
          'When we refer to ourselves as "we" or "Bohemia", or "Bohemia Health," we mean Bohemia LLC. Bohemia Health is not a chemical manufacturer, supplier, or vendor  within the FDA\'s definition. Products and Services, such as items or accessories listed for sale, certificates of analysis (COA), material safety data sheets (MSDS), or like thereof are intended for authorized recipients such as authorized institutions, academic or industrial laboratory operators, licensed chemical investigators, or professional chemists in the United States.  Items, services, material or content listed on this Website may not be intended for unauthorized audiences. We reserve the right, without waiver under the furthest extent of the law, to reject, refuse or cancel an order or service if We suspect a purchase was made for an unintended use. ',
          "Group Buys are a coordinated volume purchase facilitated by Bohemia LLC. Bohemia LLC is not a supplier, manufacturer or vendor. Certain delays due to production times, shipping speeds, carrier loss, package damage, lab processing timelines and speeds, or uncontrollable events such as customs seizure, item or test samples parcel loss or damage due to carrier possession, vendor behavior, federal, national, or international holidays, or force majeure are not considered in breach of contract. Participation within a group buy is assumed at a buyer's own risk. ",
        ]}
      />

      <SetBreadcrumb items={[{ label: "Campaigns" }]} />
    </main>
  );
}
