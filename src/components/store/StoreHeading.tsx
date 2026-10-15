import { cn } from "@/lib/utils";

// Apple store section heading: a dark lead sentence, then a gray one.
// "The latest. Take a look at what's new, right now."
export default function StoreHeading({
  lead,
  rest,
  className,
}: {
  lead: string;
  rest: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-[24px] font-medium leading-[1.12] tracking-[-0.015em] text-balance md:text-[32px] lg:text-[40px]",
        className,
      )}
    >
      {lead} <span className="text-muted-foreground">{rest}</span>
    </h2>
  );
}
