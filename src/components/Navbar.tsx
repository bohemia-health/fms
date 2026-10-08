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
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function Navbar() {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 sticky top-0 z-50 bg-background/60 backdrop-saturate-150 backdrop-blur-xl border-b">
      <Logo />
      <div className="flex items-center justify-between mx-auto">
        {/* Here is where the logo, Navbar components are implemented */}

        <NavigationMenu className="hidden md:flex">
          {/* Initialize a navigation menu list to hold the items */}
          <NavigationMenuList>
            {/* Each link should have an individual item */}
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full h-7.5 font-normal text-muted-foreground",
                )}
                render={<Link href="/shop">Store</Link>}
              />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full h-7.5 font-normal text-muted-foreground",
                )}
                render={<Link href="/campaign">Campaign</Link>}
              ></NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full h-7.5 font-normal text-muted-foreground",
                )}
                render={<Link href="/repository">Repository</Link>}
              ></NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full h-7.5 font-normal text-muted-foreground",
                )}
                render={<Link href="/news">News</Link>}
              ></NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full h-7.5 font-normal text-muted-foreground",
                )}
                render={<Link href="/menu">Partners</Link>}
              ></NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center justify-self-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="border">
              <AvatarImage src="" alt="Example Name" />
              <AvatarFallback>EN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header>
  );
}
