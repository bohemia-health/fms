import type { navLinks } from "../types";

export type LocalNavData = {
  /** Page name shown on the left, e.g. "Repository". */
  title: string;
  /** Where the title links to. */
  href?: string;
  links: navLinks[];
  /** true = LocalNav stays pinned at the top while scrolling. */
  sticky: boolean;
  /**
   * true = the bar sits on top of the page's hero image: transparent with
   * black text at the top of the page (heroes are light), frosted once the
   * user scrolls. The
   * page pulls its hero up under the bar with -mt-12. SiteBanner hides on
   * these pages since there is nowhere for it to go.
   */
  overlay?: boolean;
};
