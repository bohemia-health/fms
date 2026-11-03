import { cn } from "cn";

/**
 * One step of the buy flow's right-hand column, in Apple's shape: a bold
 * noun ("Size.") followed by a quieter prompt ("Choose your vial.") on the
 * same line, then whatever options the step offers. Each step takes most
 * of a viewport so the column reads one decision at a time as it scrolls.
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
        // lg: the same box as the sticky gallery (viewport minus the
        // ribbon), so the first step's content centres on the gallery's
        // midline and each later step is one screen down.
        "flex scroll-mt-40 flex-col py-8 lg:min-h-[calc(100vh-98px)] lg:justify-center lg:py-0",
        className,
      )}
    >
      <h2 className="text-[clamp(22px,1.9vw,28px)] leading-tight font-semibold tracking-tight">
        {title}{" "}
        <span className="font-normal text-muted-foreground">{lead}</span>
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
