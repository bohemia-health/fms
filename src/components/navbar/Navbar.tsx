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
import { BagFlyout } from "./BagFlyout";
import { SearchFlyout } from "./SearchFlyout";
import { MenuFlyout } from "./MenuFlyout";
import { FlyoutBackdrop } from "./Flyout";
import type { BagLine } from "../bag/types";

// Shared by the three right-side glyphs so weight and tap target stay in sync.
const iconStroke = 1.75;
const iconBox =
  "flex size-11 md:size-8 items-center justify-center hover:text-foreground transition-colors";

const linkClass = cn(
  navigationMenuTriggerStyle(),
  "h-7.5 px-2 text-[11px] font-light tracking-wide text-foreground hover:bg-transparent transition-colors",
);

export default function Navbar({ lines }: { lines: BagLine[] }) {
  const { navbarSticky } = useLocalNav();
  // One flyout at a time: opening Search while Bag is open swaps them.
  const [flyout, setFlyout] = useState<"bag" | "search" | "menu" | null>(null);
  const bagOpen = flyout === "bag";
  const searchOpen = flyout === "search";
  const menuOpen = flyout === "menu";
  const anyOpen = flyout !== null;
  const closeFlyout = () => setFlyout(null);
  const toggle = (which: "bag" | "search" | "menu") =>
    setFlyout((cur) => (cur === which ? null : which));
  // Badge shows units, not rows: two of one item reads 2.
  const bagCount = lines.reduce((n, l) => n + l.quantity, 0);
  // The panel is a child of the header, so one mouse-leave on the header
  // means the pointer left both the bar and the flyout.
  const onHeaderLeave = () => {
    if (anyOpen) closeFlyout();
  };
  // Navigating anywhere closes the flyout. State is adjusted during render
  // (React's "store the previous value" pattern) rather than in an effect.
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setFlyout(null);
  }
  const links: navLinks[] = [
    { href: "/shop", label: "Store" },
    { href: "/campaign", label: "Group Buy" },
    { href: "/angiogenic", label: "Angiogenic" },
    { href: "/bioregulator", label: "Bioregulator" },
    { href: "/blends", label: "Blends" },
    { href: "/glp", label: "GLP-1" },
    { href: "/mito", label: "MITO/MDPs" },
    { href: "/nootropic", label: "Nootropic" },
    { href: "/repository", label: "Repository" },
  ];
  return (
    <>
      <header
        onMouseLeave={onHeaderLeave}
        className={cn(
          "flex items-center h-12 md:h-10 top-0 z-50 backdrop-saturate-150 backdrop-blur-xl transition-colors duration-200",
          // Pages opt out with <SetNavbar sticky={false} />. `relative` keeps
          // z-50 meaningful (and anchors the bag flyout) when not sticky.
          navbarSticky ? "sticky" : "relative",
          // Solid while a flyout is open so the two read as one surface.
          anyOpen ? "bg-background" : "bg-navbar",
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
            <button
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              aria-controls="search-flyout"
              onClick={() => toggle("search")}
              className={cn(
                iconBox,
                "transition-[color,transform] duration-150 active:scale-[0.92]",
                searchOpen && "text-foreground",
              )}
            >
              <Search className="size-5 md:size-4" strokeWidth={iconStroke} />
            </button>
            <button
              type="button"
              aria-label={
                bagCount > 0
                  ? `Shopping bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`
                  : "Shopping bag"
              }
              aria-expanded={bagOpen}
              aria-controls="bag-flyout"
              onClick={() => toggle("bag")}
              className={cn(
                iconBox,
                "relative transition-[color,transform] duration-150 active:scale-[0.92]",
                bagOpen && "text-foreground",
              )}
            >
              <Bag className="size-5 md:size-4" strokeWidth={iconStroke} />
              {/* Count badge tucked at the icon's bottom-right, Apple style. The label above
                  carries the number for screen readers, so this is decorative. */}
              {bagCount > 0 && (
                <span
                  aria-hidden
                  className="absolute bottom-1.5 right-1.5 md:bottom-0.5 md:right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-medium leading-none tabular-nums text-background"
                >
                  {bagCount}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="menu-flyout"
              onClick={() => toggle("menu")}
              className={cn(
                iconBox,
                "md:hidden transition-[color,transform] duration-150 active:scale-[0.92]",
              )}
            >
              <Menu className="size-5" strokeWidth={iconStroke} />
            </button>
          </div>
        </div>
        <BagFlyout open={bagOpen} onClose={closeFlyout} lines={lines} />
        <SearchFlyout open={searchOpen} onClose={closeFlyout} />
        <MenuFlyout open={menuOpen} onClose={closeFlyout} links={links} />
      </header>
      <FlyoutBackdrop open={anyOpen} onClose={closeFlyout} />
    </>
  );
}
