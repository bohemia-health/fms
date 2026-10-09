"use client";
import { useEffect } from "react";
import { useBreadcrumb } from "./context";

// Renders nothing. A page drops this in to publish its footnotes, which the
// footer shows above its top border, numbered in order.
export default function SetFootnotes({ notes }: { notes: string[] }) {
  const { setNotes } = useBreadcrumb();
  useEffect(() => {
    setNotes(notes);
    return () => setNotes([]);
  }, []);
  return null;
}
