"use client";
import { createContext, useContext, useState } from "react";
import type { LocalNavData } from "./types";

type NavChromeContextValue = {
  /** Navbar (the global bar in layout.tsx). Defaults to sticky. */
  navbarSticky: boolean;
  setNavbarSticky: (sticky: boolean) => void;
  /** LocalNav. null = the page has none. */
  localNav: LocalNavData | null;
  setLocalNav: (data: LocalNavData | null) => void;
};

const NavChromeContext = createContext<NavChromeContextValue | null>(null);

export function LocalNavProvider({ children }: { children: React.ReactNode }) {
  const [navbarSticky, setNavbarSticky] = useState(true);
  const [localNav, setLocalNav] = useState<LocalNavData | null>(null);
  return (
    <NavChromeContext.Provider
      value={{ navbarSticky, setNavbarSticky, localNav, setLocalNav }}
    >
      {children}
    </NavChromeContext.Provider>
  );
}

export function useLocalNav() {
  const ctx = useContext(NavChromeContext);
  if (!ctx) throw new Error("useLocalNav must be used inside LocalNavProvider");
  return ctx;
}
