import Image from "next/image";
import Link from "next/link";

// One doorway in the category rail: a cut-out product image over its line
// name. On the store page it jumps to that line's rail.
export default function CategoryChip({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group/chip flex w-[112px] flex-col items-center gap-3 text-center transition-transform duration-150 ease-out active:scale-[0.97] md:w-[128px]"
    >
      <div className="relative h-[96px] w-full md:h-[112px]">
        <Image
          src="/store/mito-vial.png"
          alt=""
          fill
          sizes="128px"
          className="object-contain"
        />
      </div>
      <span className="text-[14px] font-normal text-foreground/90 group-hover/chip:text-foreground">
        {label}
      </span>
    </Link>
  );
}
