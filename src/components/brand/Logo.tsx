import React from "react";
import Link from "next/link";
import { LogoMark } from "./LogoMark";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 32,
  showText = true,
}) => {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${className}`}
    >
      <LogoMark className="h-4 w-auto text-foreground" />

      {showText && (
        <span
          style={{ fontSize: `${size * 0.55}px` }}
          className="font-semibold leading-none select-none"
        >
          Bohemia
        </span>
      )}
    </Link>
  );
};
