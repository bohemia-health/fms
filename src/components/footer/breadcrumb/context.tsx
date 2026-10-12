"use client";
import { createContext, useContext, useState } from "react";
import type { Crumb } from "./types";

type BreadcrumbContextValue = {
  items: Crumb[];
  setItems: (items: Crumb[]) => void;
  notes: React.ReactNode[];
  setNotes: (notes: React.ReactNode[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<Crumb[]>([]);
  const [notes, setNotes] = useState<React.ReactNode[]>([]);
  return (
    <BreadcrumbContext.Provider value={{ items, setItems, notes, setNotes }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx)
    throw new Error("useBreadcrumb must be used inside BreadcrumbProvider");
  return ctx;
}
