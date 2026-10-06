"use client";
import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";

type SiteBannerProps = {
  id: string;
  message: string;
  href?: string;
  linkLabel?: string;
  variant?: "info" | "warning" | "critical";
  dismissible?: boolean;
};

const BANNER_ID = "launch-2026-10";
const MESSAGE = "Scheduled Site Maintenance On: Tue Oct 6 12:57 PM CDT";

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
    <div className="relative bg-primary text-primary-foreground px-4 py-2 text-center text-sm">
      <p>{MESSAGE}</p>
      <Button
        className="absolute right-4 top-1/2 -translate-y-1/2"
        aria-label="Dismiss"
        onClick={dismiss}
      >
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}
