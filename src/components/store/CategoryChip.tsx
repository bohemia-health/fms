import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { StoreLine } from "./types";

// One doorway in the category rail: a cut-out product image over its line
// name. On the store page it jumps to that line's rail.
export default function CategoryChip({
  line,
  href,
}: {
  line: StoreLine;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group/chip flex w-[112px] flex-col items-center gap-3 text-center transition-transform duration-150 ease-out active:scale-[0.97] md:w-[128px]"
    >
      <div className="relative h-[96px] w-full md:h-[112px]">
        <Image
          src={line.image.src}
          alt=""
          fill
          sizes="128px"
          className={cn("object-contain", line.image.className)}
        />
      </div>
      <span className="text-[14px] font-normal text-foreground/90 group-hover/chip:text-foreground">
        {line.label}
      </span>
    </Link>
  );
}
