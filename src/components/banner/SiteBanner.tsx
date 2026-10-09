"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";

type SiteBannerProps = {
  id: string;
  message: string;
  href?: string;
  linkLabel?: string;
  variant?: "info" | "warning" | "critical";
  dismissible?: boolean;
};

const BANNER_ID = "launch-2026-10";
const MESSAGE =
  "A little something for your first order. Enjoy 15% off your first eligible purchase.";
// Optional. Leave LINK_HREF empty to show the message with no link.
const LINK_HREF = "/shop";
const LINK_LABEL = "Shop now";

export default function SiteBanner() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("banner-dismissed") === BANNER_ID) {
      setOpen(false);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("banner-dismissed", BANNER_ID);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="bg-footer text-foreground/65 font-thin tracking-wide text-[13px]">
      <div className={cn("flex items-center gap-4 py-1", container, "px-12")}>
        <p className="flex-1 text-center">
          {MESSAGE}
          {LINK_HREF && (
            <Link
              href={LINK_HREF}
              className="ml-2 whitespace-nowrap text-[#2997ff] hover:underline underline-offset-3"
            >
              {LINK_LABEL} &rsaquo;
            </Link>
          )}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-primary-foreground/10"
          aria-label="Dismiss"
          onClick={dismiss}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
