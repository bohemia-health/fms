import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import SetFootnotes from "@/components/footer/breadcrumb/SetFootnotes";
import {
  Tile,
  TileHeader,
  TileTitle,
  TileTagline,
  TileActions,
  TileImage,
} from "@/components/tile";
import { container } from "@/lib/layout";
import { Rail, RailCaption } from "@/components/rail/Rail";
import SetBreadcrumb from "@/components/footer/breadcrumb/SetBreadcrumb";

// apple.com/iphone hero gallery: 1260x680 cards centered, 80px gutters once the
// column no longer fits, 16px on phones. Corner radius is Apple's 28px at full
// width and scales down with the card (28/1260 = 2.22%) to a 16px floor: Apple
// keeps 28px on phones because their phone cards are 308x480 portrait, while
// ours keep the 1260/680 aspect and are only 185px tall there. vw rather than
// cqw because the card is its own @container and cqw on the container itself
// would resolve against an ancestor.
const railGutter =
  "px-[max(1rem,calc((100%-1260px)/2))] md:px-[max(5rem,calc((100%-1260px)/2))]";
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
      <section className="bg-white py-16 text-foreground [--foreground:oklch(0.145_0_0)]">
        <h1
          className={cn(
            railGutter,
            "mb-8 text-2xl font-semibold leading-snug md:text-5xl",
          )}
        >
          Here's what we've announced.
        </h1>
        <Rail
          label="Past group buys"
          nav="dots"
          className={cn(
            "gap-5",
            railGutter,
            "scroll-px-[max(1rem,calc((100%-1260px)/2))] md:scroll-px-[max(5rem,calc((100%-1260px)/2))]",
          )}
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
