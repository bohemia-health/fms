"use client";
import { useEffect } from "react";
import { useLocalNav } from "./context";
import type { LocalNavData } from "./types";

// Drop this on a page to give it a LocalNav. Pass sticky to pin it.
export default function SetLocalNav(data: LocalNavData) {
  const { setLocalNav } = useLocalNav();
  useEffect(() => {
    setLocalNav(data);
    return () => setLocalNav(null);
  }, []);
  return null;
}
