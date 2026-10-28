import { cn } from "@/lib/utils";

// Apple store section heading: a dark lead sentence, then a gray one.
// "The latest. Take a look at what's new, right now." 28px/600 from md, as
// on apple.com/store; 24px on phones.
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
        "text-[24px] font-semibold leading-[1.14] tracking-[-0.01em] text-balance md:text-[28px]",
        className,
      )}
    >
      {lead} <span className="text-muted-foreground">{rest}</span>
    </h2>
  );
}
