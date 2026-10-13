"use client";
import { useEffect } from "react";
import { useLocalNav } from "./context";

// Drop this on a page to control the global Navbar. sticky={false} lets it
// scroll away. Resets to sticky when the page unmounts.
export default function SetNavbar({ sticky }: { sticky: boolean }) {
  const { setNavbarSticky } = useLocalNav();
  useEffect(() => {
    setNavbarSticky(sticky);
    return () => setNavbarSticky(true);
  }, []);
  return null;
}
