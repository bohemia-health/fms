import Image from "next/image";
import { findLab } from ".";

export type LabButtonProps = {
  labName: string;
  href: string;
};

// The link from a report to the same report on the lab's own site. A lab
// with a file in this folder gets its logo, colours and font; any other lab
// gets a plain link, so a report with a link always has one to follow.
export default function LabButton({ labName, href }: LabButtonProps) {
  const lab = findLab(labName);
  if (!lab) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center font-medium underline-offset-4 hover:underline"
      >
        View on {labName}&rsquo;s site
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  // The shadow lifts the button off a light page. On the dark page a black
  // shadow cannot be seen, so a faint light edge does the same job there.
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-md px-4 text-sm font-medium shadow-lg shadow-black/20 transition-opacity hover:opacity-90 dark:shadow-black/60 dark:ring-1 dark:ring-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 ${lab.font}`}
      style={{ backgroundColor: lab.background, color: lab.text }}
    >
      <span>Verify at</span>
      {/* The logo is the lab's name here, so it carries the name as its
          text: the link reads "Verify at Janoshik". */}
      <Image
        src={lab.logo}
        alt={lab.name}
        width={lab.logoSize.width}
        height={lab.logoSize.height}
        className="w-auto shrink-0"
        style={{
          height: lab.logoHeight,
          transform: lab.logoOffset
            ? `translateY(${lab.logoOffset}px)`
            : undefined,
          filter: lab.invertLogo ? "brightness(0) invert(1)" : undefined,
        }}
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
