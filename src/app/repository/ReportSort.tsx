"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ReportSort({
  current,
  choices,
}: {
  current: string;
  choices: { value: string; label: string; href: string }[];
}) {
  const router = useRouter();
  const label = choices.find((choice) => choice.value === current)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-11 gap-2 rounded-full border-foreground/15 px-4 font-normal",
        )}
      >
        <span className="text-muted-foreground">Sort by</span>
        <span>{label}</span>
        <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-48 rounded-2xl p-1.5">
        <DropdownMenuRadioGroup
          aria-label="Sort lab reports"
          value={current}
          onValueChange={(value) => {
            const choice = choices.find((option) => option.value === value);
            if (choice) router.push(choice.href, { scroll: false });
          }}
        >
          {choices.map(({ value, label }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="min-h-10 rounded-xl pl-3 data-checked:font-medium"
            >
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
