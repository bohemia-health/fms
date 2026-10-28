import {
  StoreTile,
  TileBody,
  TileDetail,
  TileEyebrow,
  TileImage,
  TileLink,
  TileTagline,
  TileTitle,
} from "./StoreTile";

// A StoreTile that is not a product: a promo, a pointer to the lab reports,
// a line that is coming. Same grammar as ProductCard; `size="feature"` is
// Apple's 480-wide version for the "Help is here" rail.
export default function FeatureTile({
  eyebrow,
  title,
  tagline,
  detail,
  cta,
  href,
  image,
  tone = "light",
  size = "product",
  accent,
  priority = false,
  bleed = false,
  className,
}: {
  eyebrow: string;
  title: string;
  tagline?: string;
  /** 14px lines under the tagline: a price, a date. */
  detail?: string;
  /** Short link text, e.g. "Find your report". */
  cta?: string;
  href: string;
  image?: { src: string; alt: string; className?: string };
  tone?: "light" | "dark";
  size?: "product" | "feature";
  /** Eyebrow colour override, e.g. "text-orange-600" for pre-orders. */
  accent?: string;
  priority?: boolean;
  bleed?: boolean;
  className?: string;
}) {
  return (
    <StoreTile href={href} size={size} tone={tone} className={className}>
      <TileBody>
        <TileEyebrow className={accent}>{eyebrow}</TileEyebrow>
        <TileTitle>{title}</TileTitle>
        {tagline && <TileTagline>{tagline}</TileTagline>}
        {detail && <TileDetail>{detail}</TileDetail>}
        {cta && <TileLink>{cta}</TileLink>}
      </TileBody>
      {image && (
        <TileImage
          src={image.src}
          alt={image.alt}
          imageClassName={image.className}
          sizes={size === "feature" ? "480px" : "400px"}
          priority={priority}
          bleed={bleed}
        />
      )}
    </StoreTile>
  );
}
