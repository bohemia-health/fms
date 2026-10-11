import SetFootnotes from "@/components/footer/breadcrumb/SetFootnotes";
import { HeroText } from "@/components/HeroText";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LegacyTile,
  Tile,
  TileActions,
  TileHeader,
  TileImage,
  TileTagline,
  TileTitle,
} from "@/components/tile";
import { Logo } from "@/components/brand/Logo";
import { LogoMark } from "@/components/brand/LogoMark";

export default function Home() {
  return (
    <main>
      {/* Thymosin Beta 4 TO-D0: Make this item into a tile component that can
      be reused for marketing purposes */}
      <section className="flex flex-col items-center bg-radial from-slate-950 to-black overflow-hidden py-10">
        <div className=" pt-18">
          <span className="text-neutral-100 text-6xl font-medium">
            Thymosin{" "}
          </span>
          <span className="text-neutral-100 text-5xl font-thin">Beta 4</span>
        </div>
        <div className="pt-2">
          <p className="text-neutral-100 text-xl font-light">
            Repair is an unremarkable thing.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button variant="normal">Learn more</Button>
          <Button
            variant="normal"
            className="bg-transparent text-[#2797FF] border-[#2797FF] hover:bg-[#2797FF] hover:text-white"
          >
            Buy
          </Button>
        </div>

        <div className="relative pt-12 -mb-7 -translate-x-1.3">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-72 w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          />
          <Image
            className="relative h-auto w-100 mask-b-from-55%"
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
              <h2 className="font-medium">Bioregulators</h2>
            </TileTitle>
            <TileTagline>Masters of all trades.</TileTagline>
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
            src="/bioreg_vial.png"
            alt="Bioregulator Vial Image"
            className="translate-x-8"
          />
        </Tile>
      </div>

      <div className="grid grid-cols-1 gap-2.5 px-2.5 pt-2 md:grid-cols-2">
        <Tile theme="dark" className="aspect-[4/3] justify-start">
          <TileHeader>
            <TileTitle>
              <h2 className="font-medium text-[37px] tracking-normal">
                Adamantane-Mod Selank
              </h2>
            </TileTitle>
            <TileTagline className="text-[18px] max-w-sm mx-auto tracking-wide leading-normal">
              Tone down your anxiety with our new line of Adamantane-modified
              Selank, Adalank.
            </TileTagline>
          </TileHeader>
          <TileActions>
            <Button variant="normal" className="tracking-wide">
              Learn more
            </Button>
          </TileActions>
          <TileImage
            src="/bioreg_vial.png"
            alt="Bioregulator Vial Image"
            className="pt-4 translate-x-8"
            imageClassName="max-w-96"
          />
        </Tile>
        <Tile theme="light" className="aspect-[4/3] justify-start">
          <TileHeader>
            <TileTitle>
              <h2 className="font-medium">Bioregulators</h2>
            </TileTitle>
            <TileTagline>Masters of all trades.</TileTagline>
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
            src="/bioreg_vial.png"
            alt="Bioregulator Vial Image"
            className="pt-4 translate-x-8"
            imageClassName="max-w-96"
          />
        </Tile>
      </div>
      <SetFootnotes
        notes={[
          "The information provided on this site is for general informational and educational purposes. Certain sections of this Web site are intended for particular audiences including Bohemia's employees, as well as members of the health care community and the general public. Your access to and use of the information contained in the Web site is subject to this Terms of Use Agreement. By accessing and using this Web site you accept, without limitation or qualification, this Terms of Use Agreement.",
          "Bohemia will use reasonable efforts to include accurate and up-to-date information on this Web site but makes no warranties or representations of any kind as to its accuracy, currency or completeness. You agree that access to and use fo this Web site and the content thereof is at your own risk.",
        ]}
      />
    </main>
  );
}
