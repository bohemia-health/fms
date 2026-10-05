"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
import { Logo } from "./brand/Logo";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Logo />
      <NavigationMenu>
        {/* Initialize a navigation menu list to hold the items */}
        <NavigationMenuList>
          {/* Each link should have an individual item */}
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "rounded-full h-7.5 font-normal text-muted-foreground",
              )}
              render={<Link href="/dashboard">Dashboard</Link>}
            />
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "rounded-full h-7.5 font-normal text-muted-foreground",
              )}
              render={<Link href="/menu">Menu</Link>}
            ></NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "rounded-full h-7.5 font-normal text-muted-foreground",
              )}
              render={<Link href="/menu">Pricing</Link>}
            ></NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "rounded-full h-7.5 font-normal text-muted-foreground",
              )}
              render={<Link href="/menu">Log In</Link>}
            ></NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
