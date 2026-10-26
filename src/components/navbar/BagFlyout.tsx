"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, LogOut, Package, Settings, UserCircle } from "lucide-react";
import { Flyout } from "@asclepius/ui";
import { loginUrl } from "@/lib/auth-site";
import { authClient } from "@/lib/auth-client";

import type { BagLine } from "../bag/types";
import BagItem from "../bag/BagItem";

// Sign In is built per page so the auth site can bring the person back here.
const bagLinks = (pathname: string): BagLink[] => [
  { id: 1, label: "Orders", icon: Package, href: "/orders/list" },
  { id: 2, label: "Your Saves", icon: Bookmark, href: "/saves" },
  { id: 3, label: "Account", icon: Settings, href: "/account" },
  { id: 4, label: "Sign In", icon: UserCircle, href: loginUrl(pathname) },
];

type BagLink = {
  id: number;
  label: string;
  icon: typeof Package;
  href?: string;
  onClick?: () => void;
};

// Once signed in, the same account links minus Sign In, plus Sign Out. Sign
// Out has no href, so it renders as a button that ends the Asclepius session.
function signedInLinks(_pathname: string, signOut: () => void): BagLink[] {
  return [
    { id: 1, label: "Orders", icon: Package, href: "/orders/list" },
    { id: 2, label: "Your Saves", icon: Bookmark, href: "/saves" },
    { id: 3, label: "Account", icon: Settings, href: "/account" },
    { id: 4, label: "Sign Out", icon: LogOut, onClick: signOut },
  ];
}

type Props = { open: boolean; onClose: () => void; lines: BagLine[] };

// Bag content inside the shared Flyout shell.
export function BagFlyout({ open, onClose, lines }: Props) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const links = user
    ? signedInLinks(pathname, () => authClient.signOut())
    : bagLinks(pathname);
  return (
    <Flyout id="bag-flyout" label="Shopping bag" open={open} onClose={onClose}>
      {lines.length === 0 ? (
        <>
          <h2 className="text-2xl font-medium">Your Bag is empty.</h2>
          <p className="mt-2 text-[11.5px] font-light text-muted-foreground">
            <Link
              href="/shop"
              onClick={onClose}
              className="text-[#007AFF] underline"
            >
              Shop Now
            </Link>{" "}
          </p>
        </>
      ) : (
        <>
          {/* Heading and the Review Bag button share the top row, like
              Apple's bag flyout. No subtotal here; /bag shows it. */}
          <div className="flex items-center justify-between gap-6">
            <h2 className="text-2xl font-medium">Bag</h2>
            <Link
              href="/bag"
              onClick={onClose}
              className="rounded-full bg-[#0071E3] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#0077ED]"
            >
              Review Bag
            </Link>
          </div>
          <ul className="mt-6 space-y-5">
            {lines.map((line) => (
              <BagItem key={line.itemId} line={line} />
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-10 text-xs font-light tracking-wider text-muted-foreground">
        {user ? `Hello, ${user.firstName}` : "My Profile"}
      </h3>
      <ul className="mt-3 space-y-2 text-xs font-medium">
        {links.map(({ id, href, label, icon: IconComponent, onClick }) => (
          <li key={id}>
            {href ? (
              <Link
                href={href}
                onClick={onClose}
                className="flex items-center justify-start gap-3 text-foreground/80 hover:text-foreground transition-colors"
              >
                <IconComponent size={11} />
                {label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClick?.();
                  onClose();
                }}
                className="flex items-center justify-start gap-3 text-foreground/80 hover:text-foreground transition-colors"
              >
                <IconComponent size={11} />
                {label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </Flyout>
  );
}
