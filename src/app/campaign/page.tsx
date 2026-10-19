import SetFootnotes from "@/components/footer/breadcrumb/SetFootnotes";
import {
  Tile,
  TileHeader,
  TileTitle,
  TileTagline,
  TileActions,
  TileImage,
} from "@/components/tile";
import { Button } from "@/components/ui/button";
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

      <SetFootnotes
        notes={[
          "The information provided on this site is for general informational and educational purposes only.",
          'When we refer to ourselves as "we" or "Bohemia", or "Bohemia Health," we mean Bohemia LLC. Bohemia Health is not a chemical manufacturer, supplier, or vendor  within the FDA\'s definition. Products and Services, such as items or accessories listed for sale, certificates of analysis (COA), material safety data sheets (MSDS), or like thereof are intended for authorized recipients such as authorized institutions, academic or industrial laboratory operators, licensed chemical investigators, or professional chemists in the United States.  Items, services, material or content listed on this Website may not be intended for unauthorized audiences. We reserve the right, without waiver under the furthest extent of the law, to reject, refuse or cancel an order or service if We suspect a purchase was made for an unintended use. ',
          "Group Buys are a coordinated volume purchase facilitated by Bohemia LLC. Bohemia LLC is not a supplier, manufacturer or vendor. Certain delays due to production times, shipping speeds, carrier loss, package damage, lab processing timelines and speeds, or uncontrollable events such as customs seizure, item or test samples parcel loss or damage due to carrier possession, vendor behavior, federal, national, or international holidays, or force majeure are not considered in breach of contract. Participation within a group buy is assumed at a buyer's own risk. ",
        ]}
      />
    </main>
  );
}
