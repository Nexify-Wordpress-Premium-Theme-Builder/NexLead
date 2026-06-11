"use client";

import Image from "next/image";
import { useState } from "react";

type NexLeadLogoProps = {
  variant?: "full" | "compact";
  className?: string;
};

const LOGO_ASSETS = {
  full: {
    src: "/brand/nexlead-logo.png",
    width: 160,
    height: 56,
    className: "h-8 w-auto max-w-[min(100%,10.5rem)]",
  },
  compact: {
    src: "/brand/nexlead-icon.png",
    width: 32,
    height: 32,
    className: "h-8 w-8",
  },
} as const;

function LogoFallback({ variant }: { variant: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-white">
        N
      </span>
    );
  }

  return (
    <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-text-primary">NexLead</span>
  );
}

export function NexLeadLogo({ variant = "full", className }: NexLeadLogoProps) {
  const [imageError, setImageError] = useState(false);
  const asset = LOGO_ASSETS[variant];

  if (imageError) {
    return (
      <div className={className}>
        <LogoFallback variant={variant} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className ?? ""}`}>
      <Image
        src={asset.src}
        alt="NexLead"
        width={asset.width}
        height={asset.height}
        priority
        className={asset.className}
        onError={() => setImageError(true)}
      />
    </div>
  );
}
