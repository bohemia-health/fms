import { Plus_Jakarta_Sans } from "next/font/google";
import type { Lab } from ".";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const freedom: Lab = {
  name: "Freedom Diagnostics",
  // The white version of the mark, made for a dark background.
  logo: "/labs/freedomlogo.png",
  logoSize: { width: 75, height: 59 },
  // A stacked mark with small lettering, so it is drawn as tall as the
  // button allows.
  logoHeight: 44,
  background: "#960000",
  text: "#ffffff",
  font: plusJakartaSans.className,
};
