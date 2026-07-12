"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function QrCodeImage({
  value,
  className,
  size = 80,
}: {
  value: string;
  className?: string;
  size?: number;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: {
        dark: "#171717",
        light: "#FFFFFF",
      },
    }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className={cn("animate-pulse rounded-lg bg-muted", className)}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt={`QR code for ${value}`}
      width={size}
      height={size}
      className={cn("rounded-lg", className)}
    />
  );
}
