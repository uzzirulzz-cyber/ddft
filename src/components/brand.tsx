"use client";

import Image from "next/image";

/**
 * Brock Exchange brand lockup.
 * - `compact` (default): circular PB mark + "BROCK" wordmark with gold "O"
 * - `full`: includes the "EXCHANGE" subtitle and tagline
 */
export function Brand({
  variant = "compact",
  size = "md",
  showTagline = false,
}: {
  variant?: "compact" | "full";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}) {
  const markSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const titleSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  if (variant === "full") {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2.5">
          <Image
            src="/brock-mark.svg"
            alt="Brock Exchange mark"
            width={markSize}
            height={markSize}
            className="shrink-0"
          />
          <span className={`${titleSize} font-extrabold tracking-wider`}>
            <span className="text-white">BR</span>
            <span className="text-amber-500">O</span>
            <span className="text-white">CK</span>
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="h-px w-4 bg-blue-500" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-semibold">
            Exchange
          </span>
          <span className="h-px w-4 bg-blue-500" />
        </div>
        {showTagline && (
          <p className="mt-2 text-[10px] uppercase tracking-wider">
            <span className="text-white">Trade Smarter.</span>{" "}
            <span className="text-amber-500">Grow Faster.</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/brock-mark.svg"
        alt="Brock Exchange"
        width={markSize}
        height={markSize}
        className="shrink-0"
        priority
      />
      <div className="flex flex-col leading-tight">
        <span className={`${titleSize} font-extrabold tracking-wider`}>
          <span className="text-white">BR</span>
          <span className="text-amber-500">O</span>
          <span className="text-white">CK</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-blue-400 font-semibold">
          Exchange
        </span>
      </div>
    </div>
  );
}
