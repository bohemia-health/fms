import { BagLine } from "./types";
import Image from "next/image";

export default function BagItem({ line }: { line: BagLine }) {
  return (
    <li className="flex items-center gap-4">
      <div className="relative size-14">
        <Image
          src={line.image ?? "/store/mito-vial.png"}
          alt="product image"
          fill
          sizes="56px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-sm font-medium">
          {line.name} {line.size}
        </h1>
        <h3 className="text-xs text-muted-foreground/70"> x{line.quantity}</h3>
      </div>
    </li>
  );
}
