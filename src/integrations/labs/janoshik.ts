import { Syne } from "next/font/google";
import type { Lab } from ".";

const syne = Syne({ subsets: ["latin"] });

export const janoshik: Lab = {
  name: "Janoshik",
  logo: "/labs/janoshik.svg",
  logoSize: { width: 214, height: 56 },
  logoHeight: 28,
  // The word sits below the middle of the file; the peaks icon fills it.
  logoOffset: -3,
  background: "#EBF8FF",
  text: "#1D1D1B",
  font: syne.className,
};
