"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({
  onVerify,
}: {
  onVerify: (token: string) => void;
}) {
  const widgetId = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (containerRef.current && window.turnstile) {
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          callback: onVerify,
        });
      }
    };

    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current);
      }
    };
  }, [onVerify]);

  return <div ref={containerRef} />;
}
