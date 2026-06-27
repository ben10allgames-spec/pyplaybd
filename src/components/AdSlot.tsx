import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

const ADSENSE_CLIENT = (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined) ?? "ca-pub-3332518473430238";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  slot: string;
  format?: string;
  layout?: string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function AdSlot({
  slot,
  format = "auto",
  layout,
  responsive = true,
  className,
  style,
}: AdSlotProps) {
  const ref = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    if (typeof window === "undefined") return;
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.warn("adsbygoogle push failed", err);
    }
    // re-request fill when route changes by remounting via key prop below
  }, [pathname]);

  if (!ADSENSE_CLIENT) {
    // Placeholder shown only in dev when no publisher ID is configured
    if (import.meta.env.DEV) {
      return (
        <div
          className={`flex items-center justify-center rounded border border-dashed border-border bg-muted/30 text-xs text-muted-foreground ${className ?? ""}`}
          style={{ minHeight: 90, ...style }}
        >
          AdSense placeholder (set VITE_ADSENSE_CLIENT)
        </div>
      );
    }
    return null;
  }

  return (
    <ins
      ref={ref}
      key={pathname + slot}
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block", ...style }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
