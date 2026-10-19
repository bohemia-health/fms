import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

type TileTheme = "dark" | "light" | "pumpkin";

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
        "data-[theme=pumpkin]:bg-[radial-gradient(50%_50%_at_50%_50%,#183A37_0%,#000_100%)]",
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
      className={cn("pt-8 md:pt-13", className)}
      {...props}
    />
  );
}

function TileTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="tile-title"
      className={cn(
        "text-[36px] md:text-[44px] lg:text-[54px] leading-none tracking-[-0.020em]",
        "group-data-[theme=dark]/tile:text-neutral-100 group-data-[theme=light]/tile:text-gray-950 group-data-[theme=pumpkin]/tile:text-neutral-100",
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
        "mt-1 text-[19px] md:text-[21px] lg:text-[23px] font-light",
        "group-data-[theme=dark]/tile:text-neutral-100 group-data-[theme=light]/tile:text-gray-950 group-data-[theme=pumpkin]/tile:text-neutral-100",
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
      className={cn(
        "flex flex-wrap justify-center gap-3 pt-5 md:gap-4 md:pt-6",
        className,
      )}
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
        className={cn("relative h-auto w-[min(25rem,85vw)]", imageClassName)}
        width={width}
        height={height}
        alt={alt}
        {...props}
      />
    </div>
  );
}

export { Tile, TileHeader, TileTitle, TileTagline, TileActions, TileImage };
