import type { LucideIcon } from "lucide-react";

export type LegalCard = {
  /** Pass the icon component itself (Lock), not an element (<Lock />). */
  icon: LucideIcon;
  title: string;
  body: string;
  link: { label: string; href: string };
  /** true = the card spans both grid columns on md and up. */
  wide?: boolean;
};

export type LegalSection = {
  /** Anchor the LocalNav jumps to: "policies" -> href "#policies". */
  id: string;
  heading: string;
  cards: LegalCard[];
};
