import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Rail, RailItem } from "@/components/rail/Rail";
import StoreHeading from "./StoreHeading";
import { storeDifferences } from "./lines";
import { storeColumn } from "./types";

// Closing trust row, like "The Apple Store difference": white cards on the
// grey store field with an icon, one sentence, and a link; card-dark in dark.
export default function StoreDifference() {
  return (
    <section id="difference" className="scroll-mt-12 py-8 md:py-12">
      <div className={storeColumn}>
        <StoreHeading
          lead="The Bohemia Store difference."
          rest="Even more reasons to buy here."
          className="mb-6 md:mb-8"
        />
      </div>
      <Rail label="Why buy from Bohemia">
        {storeDifferences.map(({ icon: Icon, text, link }) => (
          <RailItem key={link.href} className="w-[260px] md:w-[300px]">
            <div className="flex h-[200px] flex-col justify-between rounded-[18px] bg-card p-6 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] md:p-7 dark:shadow-none dark:ring-1 dark:ring-foreground/10">
              <Icon size={32} strokeWidth={1.25} className="text-[#0065CC]" />
              <div className="flex flex-col gap-2">
                <p className="text-[17px] font-medium leading-snug text-balance">
                  {text}
                </p>
                <Link
                  href={link.href}
                  className="inline-flex items-center text-[14px] font-light text-[#0065CC] hover:underline"
                >
                  {link.label}
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </RailItem>
        ))}
      </Rail>
    </section>
  );
}
