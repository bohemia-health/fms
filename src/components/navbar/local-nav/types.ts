import type { navLinks } from "../types";

export type LocalNavData = {
  /** Page name shown on the left, e.g. "Repository". */
  title: string;
  /** Where the title links to. */
  href?: string;
  links: navLinks[];
  /** true = LocalNav stays pinned at the top while scrolling. */
  sticky: boolean;
};
