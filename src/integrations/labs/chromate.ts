import { Noto_Sans } from "next/font/google";
import type { Lab } from ".";

const notoSans = Noto_Sans({ subsets: ["latin"] });

export const chromate: Lab = {
  name: "Chromate",
  logo: "/labs/chromate.svg",
  logoSize: { width: 187, height: 57 },
  logoHeight: 28,
  // The file is near-black artwork, which would vanish on this navy.
  invertLogo: true,
  background: "#031524",
  text: "#ffffff",
  font: notoSans.className,
};
