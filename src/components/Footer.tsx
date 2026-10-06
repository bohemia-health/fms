"use client";
import Link from "next/link";
import { Logo } from "./brand/Logo";
import { FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const megaFooterLinks = [
  {
    heading: "Shop and Learn",
    links: [
      { label: "Store", href: "/shop" },
      { label: "Group Buys", href: "/group_buys" },
      { label: "Retatrutide", href: "/shop/retatrutide" },
      { label: "Tirzepatide", href: "/shop/tirzepatide" },
      { label: "Semaglutide", href: "/shop/semaglutide" },
    ],
  },

  {
    heading: "Account",
    links: [
      { label: "Manage Your Account", href: "/account" },
      { label: "Order Status", href: "/order/status" },
    ],
  },
  {
    heading: "For Users",
    links: [
      { label: "Contact Support", href: "/support" },
      { label: "Shopping Help", href: "/faq" },
      { label: "Repository", href: "/repository" },
      { label: "Find a COA", href: "/repository/lab_reports" },
    ],
  },
  {
    heading: "About Bohemia",
    links: [
      { label: "Newsroom", href: "/news" },
      { label: "Ethics & Compliance", href: "/ethics-compliance" },
      { label: "Privacy Notice", href: "/privacy" },
      { label: "Cookie Notice", href: "/cookies" },
      { label: "Terms & Conditions", href: "/tos" },
      { label: "Code of Conduct", href: "/code-of-conduct" },
    ],
  },
];

const socialLinks = [
  { label: "Telegram", href: "#", icon: FaTelegram },
  { label: "X", href: "#", icon: FaXTwitter },
];

export default function MegaFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* brand block, spans 2 */}
          <div className="col-span-2 space-y-4">
            <Logo />
            <p className="max-w-xs text-sm font-light text-muted-foreground">
              Discover the innovative world of biology and science.
            </p>

            <div className="flex gap-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* link columns, 1 each */}
          {megaFooterLinks.map((column) => (
            <div key={column.heading} className="space-y-3">
              <h3 className="text-sm font-medium">{column.heading}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t pt-8 text-xs text-muted-foreground font-light md:flex-row md:items-center md:justify-between">
          <p>© 2026 BOHEMIA. All rights reserved.</p>
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
    </footer>
  );
}
