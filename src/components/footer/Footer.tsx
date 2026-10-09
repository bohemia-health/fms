"use client";
import Link from "next/link";
import { Logo } from "../brand/Logo";
import { FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { footerColumn } from "./links";
import Breadcrumb from "./breadcrumb/Breadcrumb";
import Footnotes from "./Footnotes";
import { container } from "@/lib/layout";
import { useBreadcrumb } from "./breadcrumb/context";

const socialLinks = [
  { label: "Telegram", href: "#", icon: FaTelegram },
  { label: "X", href: "#", icon: FaXTwitter },
];

export default function MegaFooter() {
  const { items, notes } = useBreadcrumb();
  return (
    <footer className="bg-footer py-1">
      <div className={container}>
        <Footnotes notes={notes} />
        <div className="border-t border-muted-foreground/35 py-5">
          <Breadcrumb items={items} />
          <div className="grid grid-cols-2 md:grid-cols-5 py-4">
            {/* link columns, 1 each */}
            {footerColumn.map((groups, i) => (
              <div key={i} className="space-y-6">
                {groups.map((group) => (
                  <div key={group.heading} className="space-y-1.5">
                    <h3 className="text-[12px] font-medium text-[#444445]/95">
                      {group.heading}
                    </h3>
                    <ul className="space-y-2">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block text-[11.5px] leading-[1.4] text-foreground/65 hover:underline transition-colors text-shadow-muted-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t pt-8 text-xs text-muted-foreground font-light md:flex-row md:items-center md:justify-between">
            <p>Copyright © 2026 BOHEMIA. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/policy/refunds" className="hover:text-foreground">
                Sales and Refunds
              </Link>
              <Link href="/cookies" className="hover:text-foreground">
                Cookie Notice
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Notice
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/legal" className="hover:text-foreground">
                Legal
              </Link>
              <Link href="/site-map" className="hover:text-foreground">
                Site Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
