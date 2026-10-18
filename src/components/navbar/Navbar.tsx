"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";
import { Search } from "lucide-react";
import { Bag } from "../icons/bag";
import { Menu } from "../icons/menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "../brand/Logo";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { navLinks } from "./types";
import { useLocalNav } from "./local-nav/context";
import { BagFlyout, BagBackdrop } from "./BagFlyout";

// Shared by the three right-side glyphs so weight and tap target stay in sync.
const iconStroke = 1.75;
const iconBox =
  "flex size-11 md:size-8 items-center justify-center hover:text-foreground transition-colors";

const linkClass = cn(
  navigationMenuTriggerStyle(),
  "h-7.5 px-2 text-[11px] font-light tracking-wide text-foreground hover:bg-transparent transition-colors",
);

export default function Navbar() {
  const { navbarSticky } = useLocalNav();
  const [bagOpen, setBagOpen] = useState(false);
  const closeBag = () => setBagOpen(false);
  // Navigating anywhere closes the flyout. State is adjusted during render
  // (React's "store the previous value" pattern) rather than in an effect.
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setBagOpen(false);
  }
  const links: navLinks[] = [
    { href: "/shop", label: "Store" },
    { href: "/campaign", label: "Group Buy" },
    { href: "/news", label: "News" },
    { href: "/research/mito", label: "MITO" },
    { href: "/research/nootropic", label: "Nootropic" },
    { href: "/research/bioregulator", label: "Bioregulator" },
    { href: "/repository", label: "Repository" },
    { href: "/support", label: "Support" },
  ];
  return (
    <>
      <header
        className={cn(
          "flex items-center h-12 md:h-10 top-0 z-50 backdrop-saturate-150 backdrop-blur-xl transition-colors duration-200",
          // Pages opt out with <SetNavbar sticky={false} />. `relative` keeps
          // z-50 meaningful (and anchors the bag flyout) when not sticky.
          navbarSticky ? "sticky" : "relative",
          // Solid while the bag flyout is open so the two read as one surface.
          bagOpen ? "bg-background" : "bg-navbar",
        )}
      >
        {/* Here is where the logo, Navbar components are implemented */}
        <div className={cn("flex items-center justify-between", container)}>
          <Logo showText={false} />
          <NavigationMenu className="hidden md:flex flex-1 max-w-none">
            <NavigationMenuList className="justify-evenly">
              {links.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    className={linkClass}
                    render={<Link href={link.href}>{link.label}</Link>}
                  />
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center text-foreground -mr-3 md:-mr-2">
            <Link href="/search" aria-label="Search" className={iconBox}>
              <Search className="size-5 md:size-4" strokeWidth={iconStroke} />
            </Link>
            <button
              type="button"
              aria-label="Shopping bag"
              aria-expanded={bagOpen}
              aria-controls="bag-flyout"
              onClick={() => setBagOpen((o) => !o)}
              className={cn(
                iconBox,
                "transition-[color,transform] duration-150 active:scale-[0.92]",
                bagOpen && "text-foreground",
              )}
            >
              <Bag className="size-5 md:size-4" strokeWidth={iconStroke} />
            </button>
            <button
              type="button"
              aria-label="Open menu"
              className={cn(iconBox, "md:hidden")}
            >
              <Menu className="size-5" strokeWidth={iconStroke} />
            </button>
          </div>
        </div>
        <BagFlyout open={bagOpen} onClose={closeBag} />
      </header>
      <BagBackdrop open={bagOpen} onClose={closeBag} />
    </>
  );
}
