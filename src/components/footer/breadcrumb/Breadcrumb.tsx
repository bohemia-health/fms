import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import type { Crumb } from "./types";

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link href="/" aria-label="Home" className="text-foreground">
            <LogoMark className="h-4 w-auto" />
          </Link>
        </li>

        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRightIcon className="size-3" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
