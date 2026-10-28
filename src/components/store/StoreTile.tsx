import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// The store tile, apple.com/store's card grammar: a white card on the grey
// store field, 18px corners, 28px padding, text pinned top-left in this
// order: eyebrow (12/600 uppercase), title (28/600), tagline (17/600), then
// detail lines at 14px; the lower part of the card is the image. Product
// tiles are 400×500, feature tiles 480×500; both are one link. Shadow
// carries the edge in light mode, a hairline ring does in dark. Compound
// parts like the home page's Tile, so ProductCard and FeatureTile share one
// look and differ only in what they put in the slots.

type TileSize = "product" | "feature";
type TileTone = "light" | "dark";

function StoreTile({
  href,
  size = "product",
  tone = "light",
  className,
  children,
}: {
  href: string;
  size?: TileSize;
  tone?: TileTone;
  className?: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-tone={tone}
      className={cn(
        "group/tile block shrink-0 rounded-[18px] outline-none",
        size === "product"
          ? "h-[440px] w-[290px] md:h-[500px] md:w-[400px]"
          : "h-[440px] w-[320px] md:h-[500px] md:w-[480px]",
        // scale-* sets the CSS `scale` property in Tailwind v4, so transition that.
        "transition-[scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "[@media(hover:hover)]:hover:scale-[1.01] active:scale-[0.99] active:duration-150",
        // Reduced motion keeps the shadow change (a colour) and drops the lift.
        "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
        "focus-visible:ring-2 focus-visible:ring-[#0065CC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f5f7] dark:focus-visible:ring-offset-background",
        className,
      )}
    >
      <Card
        className={cn(
          "h-full gap-0 rounded-[18px] py-0 ring-0",
          tone === "light"
            ? "bg-card text-card-foreground shadow-[2px_4px_12px_rgba(0,0,0,0.08)] dark:shadow-none dark:ring-1 dark:ring-foreground/10"
            : "bg-[#1d1d1f] text-white dark:ring-1 dark:ring-white/10",
          "transition-[box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          tone === "light" &&
            "[@media(hover:hover)]:group-hover/tile:shadow-[2px_4px_16px_rgba(0,0,0,0.16)]",
        )}
      >
        {children}
      </Card>
    </Link>
  );
}

// The text block: 28px padding, nothing below it but the image.
function TileBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tile-body"
      className={cn("relative z-10 p-7", className)}
      {...props}
    />
  );
}

function TileEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="tile-eyebrow"
      className={cn(
        "text-[12px] font-semibold uppercase leading-4 tracking-[-0.01em]",
        "text-foreground/60 group-data-[tone=dark]/tile:text-white/60",
        className,
      )}
      {...props}
    />
  );
}

function TileTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="tile-title"
      className={cn(
        "mt-2 text-[24px] font-semibold leading-7 tracking-[0.007em] text-balance md:text-[28px] md:leading-8",
        className,
      )}
      {...props}
    />
  );
}

function TileTagline({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="tile-tagline"
      className={cn("mt-2 text-[17px] font-semibold leading-[1.3]", className)}
      {...props}
    />
  );
}

// 14px lines under the tagline: price, sizes, a note.
function TileDetail({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="tile-detail"
      className={cn(
        "mt-2 text-[14px] font-light leading-[1.45]",
        "text-foreground/80 group-data-[tone=dark]/tile:text-white/70",
        className,
      )}
      {...props}
    />
  );
}

function TileLink({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="tile-link"
      className={cn(
        "mt-3 inline-flex items-center text-[14px] font-light",
        "text-[#0065CC] group-data-[tone=dark]/tile:text-[#2997FF] group-hover/tile:underline",
        className,
      )}
      {...props}
    >
      {props.children}
      <ChevronRight size={16} />
    </p>
  );
}

// The image takes whatever height the text leaves. It stays inside the
// padding unless `bleed`: a render made to touch the edge can, a vial cut
// by the card edge reads as a crop.
function TileImage({
  src,
  alt,
  bleed = false,
  priority = false,
  sizes = "400px",
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  bleed?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      data-slot="tile-image"
      className={cn("relative mx-7 min-h-0 flex-1", !bleed && "mb-7", className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-contain transition-[scale] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
          bleed ? "object-bottom" : "object-center",
          "[@media(hover:hover)]:group-hover/tile:scale-[1.03] motion-reduce:group-hover/tile:scale-100",
          imageClassName,
        )}
      />
    </div>
  );
}

export {
  StoreTile,
  TileBody,
  TileEyebrow,
  TileTitle,
  TileTagline,
  TileDetail,
  TileLink,
  TileImage,
};
