"use client";

import { CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// The circled "?" beside "Estimated tax". A real button so keyboards and
// screen readers reach it; the tooltip opens on hover and on focus.
export default function TaxHelp({ className }: { className?: string }) {
  return (
    // Base UI waits 600ms by default, long enough that a quick hover never
    // sees it. The delay lives on the provider; 150ms reads as instant.
    <TooltipProvider delay={150}>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label="How tax is estimated"
              className={cn(
                "inline-flex rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0065CC]",
                className,
              )}
            />
          }
        >
          <CircleHelp size={16} strokeWidth={1.5} />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56 text-center">
          The sales tax listed on the checkout page is only an estimate. Your
          invoice will contain the final sales tax, including state and local
          taxes, as well as any applicable rebates or fees.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
