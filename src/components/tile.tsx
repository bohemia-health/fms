import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

type TileTheme = "dark" | "light";

function Tile({
  className,
  theme = "dark",
  ...props
}: React.ComponentProps<"section"> & { theme?: TileTheme }) {
  return (
    <section
      data-slot="tile"
      data-theme={theme}
      className={cn(
        "group/tile flex flex-col items-center text-center overflow-hidden py-5",
        "data-[theme=dark]:bg-radial data-[theme=dark]:from-slate-950 data-[theme=dark]:to-black",
        "data-[theme=light]:bg-[#F5F5F7]",
        className,
      )}
      {...props}
    />
  );
}

function TileHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tile-header"
      className={cn("pt-13", className)}
      {...props}
    />
  );
}

function TileTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="tile-title"
      className={cn(
        "text-[54px] leading-none tracking-[-0.020em]",
        "group-data-[theme=dark]/tile:text-neutral-100 group-data-[theme=light]/tile:text-gray-950",
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
      className={cn(
        "mt-1 text-[23px] font-light",
        "group-data-[theme=dark]/tile:text-neutral-100 group-data-[theme=light]/tile:text-gray-950",
        className,
      )}
      {...props}
    />
  );
}

function TileActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tile-actions"
      className={cn("flex flex-wrap gap-4 pt-6", className)}
      {...props}
    />
  );
}

type TileImageProps = React.ComponentProps<typeof Image> & {
  /** Extra classes for the <img> itself. `className` goes on the wrapper. */
  imageClassName?: string;
};

function TileImage({
  className,
  imageClassName,
  width = 390,
  height = 238,
  alt,
  ...props
}: TileImageProps) {
  return (
    <div data-slot="tile-image" className={cn("relative pt-12", className)}>
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 hidden h-72 w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/30 blur-3xl group-data-[theme=dark]/tile:block"
      />
      <Image
        className={cn("relative h-auto w-100", imageClassName)}
        width={width}
        height={height}
        alt={alt}
        {...props}
      />
    </div>
  );
}

export { Tile, TileHeader, TileTitle, TileTagline, TileActions, TileImage };

/* ------------------------------------------------------------------ */
/* LegacyTile: the old props-based tile, built on the pieces above.    */
/* Still used by the MITO and Bioregulators tiles on the home page.    */
/* Delete once those are converted.                                    */
/* ------------------------------------------------------------------ */

type LegacyTileProps = {
  title: string;
  subtitle?: string;
  tagline?: string;
  image: string;
  imageAlt: string;
  theme?: TileTheme;
  priority?: boolean;
  imageClassName?: string;
  imageWrapperClassName?: string;
};

export function LegacyTile({
  title,
  subtitle,
  tagline,
  image,
  imageAlt,
  theme = "dark",
  priority = false,
  imageClassName,
  imageWrapperClassName,
}: LegacyTileProps) {
  return (
    <Tile theme={theme}>
      <TileHeader>
        <TileTitle>
          <span className="font-medium">{title}</span>
          <span className="font-thin">{subtitle}</span>
        </TileTitle>
        <TileTagline>{tagline}</TileTagline>
      </TileHeader>
      <TileActions>
        <Button variant="normal" className="tracking-wide">
          Learn more
        </Button>
        <Button
          variant="normal"
          className="tracking-wide bg-transparent text-[#2797FF] border-[#2797FF] hover:bg-[#2797FF] hover:text-white"
        >
          Buy
        </Button>
      </TileActions>
      <TileImage
        src={image}
        alt={imageAlt}
        priority={priority}
        className={imageWrapperClassName}
        imageClassName={imageClassName}
      />
    </Tile>
  );
}
