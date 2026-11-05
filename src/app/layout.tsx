import type { Metadata } from "next";
import "./globals.css";
import { AUTH_URL } from "@/lib/auth-site";
import { SITE_URL } from "./sitemap";
import { ThemeProvider } from "next-themes";
import {
  BreadcrumbProvider,
  LocalNav,
  MegaFooter,
  NavChromeProvider,
  type NavLink,
} from "@asclepius/ui";
import StoreNavbar from "@/components/navbar/StoreNavbar";
import { shopCategories } from "@/components/navbar/shop-categories";
import SiteBanner from "@/components/banner/SiteBanner";
import { getBagLines } from "@/app/bag/bag";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Bohemia Health", template: "%s – Bohemia Health" },
  description:
    "Science, without the unnecessary. Bohemia Health is empowering and redefining scientific discovery with a modern approach to simplify the biotechnological experience.",
  openGraph: { siteName: "Bohemia Health", type: "website" },
};

const links: NavLink[] = [
  { href: "/shop", label: "Store" },
  { href: "/campaign", label: "Group Buy" },
  ...shopCategories.map(({ href, label }) => ({ href, label })),
  { href: "/repository", label: "Repository" },
];

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const bagLines = await getBagLines();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BreadcrumbProvider>
            <NavChromeProvider>
              <StoreNavbar links={links} lines={bagLines} />
              <LocalNav />
              <SiteBanner />
              {children}
              <MegaFooter authUrl={AUTH_URL} />
            </NavChromeProvider>
          </BreadcrumbProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
