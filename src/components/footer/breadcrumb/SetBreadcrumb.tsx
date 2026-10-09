"use client";
import { useEffect } from "react";
import { useBreadcrumb } from "./context";
import type { Crumb } from "./types";

export default function SetBreadcrumb({ items }: { items: Crumb[] }) {
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems(items);
    return () => setItems([]);
  }, []);
  return null;
}
