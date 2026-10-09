"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { container } from "@/lib/layout";
import { MagnifyingGlass, Bag } from "@phosphor-icons/react";
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

const linkClass = cn(
  navigationMenuTriggerStyle(),
  "h-7.5 px-2 text-[11px] font-light tracking-wide text-muted-foreground hover:text-foreground/90 hover:bg-transparent transition-colors",
);

export default function Navbar() {
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
    <header className="flex items-center h-10 sticky top-0 z-50 bg-navbar backdrop-saturate-150 backdrop-blur-xl">
      {/* Here is where the logo, Navbar components are implemented */}
      <div className={cn("flex items-center justify-between", container)}>
        <NavigationMenu className="hidden md:flex flex-1 max-w-none">
          <Logo showText={false} />
          <NavigationMenuList className="justify-evenly">
            {links.map((link, index) => (
              <NavigationMenuItem>
                <NavigationMenuLink
                  key={index}
                  className={linkClass}
                  render={<Link href={link.href}>{link.label}</Link>}
                />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-5 text-muted-foreground">
          <Link
            href="/search"
            aria-label="Search"
            className="hover:text-foreground transition-colors"
          >
            <MagnifyingGlass className="size-4" weight="light" />
          </Link>
          <Link
            href="/bag"
            aria-label="Shopping bag"
            className="hover:text-foreground transition-colors"
          >
            <Bag className="size-4" weight="light" />
          </Link>
        </div>
      </div>
    </header>
  );
}
