import { cn } from "cn";

/**
 * One step of the buy flow's right-hand column, in Apple's shape: a bold
 * noun ("Size.") followed by a quieter prompt ("Choose your vial.") on the
 * same line, followed by the available options. Steps share a consistent
 * spacing rhythm without reserving a full screen for short content.
 */
export function ConfigStep({
  id,
  title,
  lead,
  children,
  className,
}: {
  /** Anchor for the step, e.g. "size" -> #size. */
  id: string;
  /** The bold noun, with its full stop: "Size." */
  title: string;
  /** The quieter prompt after it: "Choose your vial." */
  lead: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "flex scroll-mt-40 flex-col border-b border-foreground/10 py-8 first:pt-0 last:border-b-0 last:pb-0 lg:py-10",
        className,
      )}
    >
      <h2 className="text-[22px] leading-[1.35] font-semibold tracking-[-0.025em] text-pretty">
        {title}{" "}
        <span className="font-normal text-muted-foreground">{lead}</span>
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
