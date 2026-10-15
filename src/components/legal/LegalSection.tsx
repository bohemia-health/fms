import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";
import LegalCard from "./LegalCard";
import type { LegalSection as LegalSectionData } from "./types";

// An anchor target plus a two-up grid of cards. No visible heading: like Apple's
// legal page, the cards flow as one grid and the LocalNav links jump into it.
// py-10 on each section matches the grid's row gap, so spacing stays even across
// section boundaries. scroll-mt-12 keeps the first row clear of the sticky bar.
export default function LegalSection({ id, cards }: LegalSectionData) {
  return (
    <section id={id} className={cn(container, "scroll-mt-12 py-10")}>
      <div className="grid gap-y-20 md:grid-cols-2 md:gap-x-24">
        {cards.map((card) => (
          <LegalCard key={card.link.href} {...card} />
        ))}
      </div>
    </section>
  );
}
