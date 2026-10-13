"use client";
import Link from "next/link";
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

// Shared by the three right-side glyphs so weight and tap target stay in sync.
const iconStroke = 1.75;
const iconBox =
  "flex size-11 md:size-8 items-center justify-center hover:text-foreground transition-colors";

const linkClass = cn(
  navigationMenuTriggerStyle(),
  "h-7.5 px-2 text-[11px] font-light tracking-wide text-muted-foreground hover:text-foreground/90 hover:bg-transparent transition-colors",
);

export default function Navbar() {
  const { navbarSticky } = useLocalNav();
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
    <header
      className={cn(
        "flex items-center h-12 md:h-10 top-0 z-50 bg-navbar backdrop-saturate-150 backdrop-blur-xl",
        // Pages opt out with <SetNavbar sticky={false} />.
        navbarSticky && "sticky",
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

        <div className="flex items-center text-foreground/80 -mr-3 md:-mr-2">
          <Link href="/search" aria-label="Search" className={iconBox}>
            <Search className="size-5 md:size-4" strokeWidth={iconStroke} />
          </Link>
          <Link href="/bag" aria-label="Shopping bag" className={iconBox}>
            <Bag className="size-5 md:size-4" strokeWidth={iconStroke} />
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            className={cn(iconBox, "md:hidden")}
          >
            <Menu className="size-5" strokeWidth={iconStroke} />
          </button>
        </div>
      </div>
    </header>
  );
}
