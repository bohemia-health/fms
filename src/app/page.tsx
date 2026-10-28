import { SetFootnotes } from "@asclepius/ui";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tile,
  TileActions,
  TileHeader,
  TileImage,
  TileTagline,
  TileTitle,
} from "@/components/tile";
import Link from "next/link";
import { Fragment } from "react";

export default function Home() {
  return (
    <main>
      {/* Thymosin Beta 4 TO-D0: Make this item into a tile component that can
      be reused for marketing purposes */}
      <section className="flex flex-col items-center bg-radial from-slate-950 to-black overflow-hidden py-10">
        <div className="pt-10 md:pt-18">
          <span className="text-neutral-100 text-[36px] md:text-[44px] lg:text-6xl font-medium">
            Thymosin{" "}
          </span>
          <span className="text-neutral-100 text-[30px] md:text-[36px] lg:text-5xl font-thin">
            Beta 4
          </span>
        </div>
        <div className="pt-2">
          <p className="text-neutral-100 text-[19px] md:text-[21px] lg:text-xl font-light">
            Repair is an unremarkable thing.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-4 md:gap-4">
          <Button variant="normal">Learn more</Button>
          <Link
            href="/shop/repair"
            className={cn(
              buttonVariants({ variant: "normal" }),
              "bg-transparent text-[#2797FF] border-[#2797FF] hover:bg-[#2797FF] hover:text-white",
            )}
          >
            Buy
          </Link>
        </div>

        <div className="relative pt-8 md:pt-12 -mb-7">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-72 w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          />
          <Image
            className="relative h-auto w-[min(25rem,85vw)] mask-b-from-55%"
            src="/image 12.png"
            alt="Thymosin Beta 4 vial"
            width={390}
            height={238}
            priority
          />
        </div>
      </section>
      {/* End of TB4 Section */}
      <div className="flex flex-col gap-2.5">
        {/* 
                <Tile theme="dark">
          <TileHeader>
            <TileTitle>
              <span className="font-medium">Thymosin </span>
              <span className="font-thin">Beta 4</span>
            </TileTitle>
            <TileTagline>Repair is an unremarkable thing.</TileTagline>
          </TileHeader>
          <TileActions>
            <Button variant="normal" className="tracking-wide">
              Learn more
            </Button>
            <Button
              variant="normal"
              className="tracking-wide bg-transparent text-[#2797FF] border-[#2797FF] hover:bg-[#2797FF] hover:text-white"
            >
              Buy
            </Button>
          </TileActions>
          <TileImage
            src="/image 12.png"
            alt="Thymosin Beta 4 vial"
            className="-mb-7 -translate-x-1.3"
            imageClassName="mask-b-from-55%"
          />
        </Tile>
        
        */}

        <Tile theme="light">
          <TileHeader>
            <TileTitle>
              <span className="font-medium">Bioregulators</span>
            </TileTitle>
            <TileTagline>Masters of all trades.</TileTagline>
          </TileHeader>
          <TileActions>
            <Button variant="normal" className="tracking-wide">
              Learn more
            </Button>
            <Link
              href="/shop/bioregulator"
              className={cn(
                buttonVariants({ variant: "normal" }),
                "tracking-wide bg-transparent text-[#2797FF] border-[#2797FF] hover:bg-[#2797FF] hover:text-white",
              )}
            >
              Buy
            </Link>
          </TileActions>
          <TileImage
            src="/bioreg_vial.png"
            alt="Bioregulator vial"
            className="md:translate-x-8"
            priority
          />
        </Tile>
      </div>

      <div className="grid grid-cols-1 gap-2.5 px-2.5 pt-2 pb-2 md:grid-cols-2">
        <Tile theme="dark" className="h-[500px] md:h-[580px] justify-start">
          <TileHeader>
            <TileTitle className="md:text-[36px] lg:text-[48px] xl:text-[54px]">
              <span className="font-medium tracking-normal">
                Adamantane‑Mod Selank
              </span>
            </TileTitle>
            <TileTagline className="tracking-wide leading-normal">
              Now held in a carbon cage.
            </TileTagline>
          </TileHeader>
          <TileActions>
            <Link
              href="/shop/nootropic"
              className={cn(buttonVariants({ variant: "normal" }), "tracking-wide")}
            >
              View Pricing
            </Link>
          </TileActions>
          <TileImage
            src="/adalank-crop.png"
            alt="Adamantane-Mod Selank nasal spray"
            className="mt-auto pt-0 -mb-5"
            imageClassName="max-w-80"
          />
        </Tile>
        <Tile theme="light" className="h-[500px] md:h-[580px] justify-start">
          <TileHeader>
            <TileTitle className="md:text-[36px] lg:text-[48px] xl:text-[54px]">
              <span className="font-medium">Accessories</span>
            </TileTitle>
            <TileTagline>Masters of all trades.</TileTagline>
          </TileHeader>
          <TileActions>
            <Button variant="normal" className="tracking-wide">
              Learn more
            </Button>
            <Link
              href="/shop/accessories"
              className={cn(
                buttonVariants({ variant: "normal" }),
                "tracking-wide bg-transparent text-[#2797FF] border-[#2797FF] hover:bg-[#2797FF] hover:text-white",
              )}
            >
              Buy
            </Link>
          </TileActions>
          <TileImage
            src="/vials-in-a-line.png"
            alt="Four empty glass vials in a row"
            className="mt-auto pt-0"
            imageClassName="w-[30rem] max-w-full"
          />
        </Tile>
      </div>
      <SetFootnotes
        notes={[
          <Fragment key="note-1">
            The information provided on this site is for general informational
            and educational purposes. Certain sections of this site are intended
            for particular audiences including Bohemia&rsquo;s employees,
            subsidiaries and shareholders, as well as the general public. Your
            access to and use of the information contained in this site is
            subject to the Terms of Use Agreement. By accessing and using this
            site, you accept, without limitation of qualification, the Terms of
            Use Agreement at{" "}
            <Link href="/terms-of-use" className="underline">
              https://bhmhlth.com/terms-of-use
            </Link>
          </Fragment>,
          "Bohemia will use reasonable efforts to include accurate and up-to-date information on this site but makes no warranties or representations of any kind as to its accuracy, currency or completeness. You agree that access to and use of this site and the content thereof is at your own risk. Bohemia disclaims all warranties, express or implied.",
          "The entire contents of this site are subject to copyright protection. Copyright 2025-2026 Bohemia LLC. Except as expressly provided above, you may not otherwise copy, display, download, distribute, modify, reproduce, republish or retransmit any information, text or documents contained in this site or create any derivative work based on such images, text or documents, without the express written consent of Bohemia. You are expressly prohibited from using robots, spiders, scripts, service, software or any manual or automatic device, tool, or process design to data mine or scrape any content from this website, or otherwise use, access, or collect any content using automated means, except for purposes for inclusion in a public search engine.",
        ]}
      />
    </main>
  );
}
