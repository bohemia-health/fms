import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import type { LegalCard as LegalCardData } from "./types";

// One card on the legal hub: icon, title, blurb, and a single link.
// Column cards are left-aligned; a wide card spans the grid and centers, like
// Apple's legal page.
export default function LegalCard({ icon: Icon, title, body, link, wide }: LegalCardData) {
  const align = wide ? "items-center text-center" : "items-start text-left";
  return (
    <div className={cn("flex flex-col gap-4", align, wide && "md:col-span-2")}>
      <Icon size={144} strokeWidth={1} />
      <div className={cn("flex flex-col gap-2", align)}>
        <h3 className="text-[32px] font-medium">{title}</h3>
        <p className={cn("font-light tracking-wide", wide ? "max-w-2xl" : "max-w-sm")}>
          {body}
        </p>
        <Link
          href={link.href}
          className="inline-flex items-center text-[#0065CC] text-[16px] hover:underline font-light"
        >
          {link.label} <ChevronRightIcon size={20} />
        </Link>
      </div>
    </div>
  );
}
