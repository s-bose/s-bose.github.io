"use client";

import Script from "next/script";

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding: boolean;
      }) => void;
    };
  }
}

export function CalendlyBadge() {
  return (
    <>
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.Calendly?.initBadgeWidget({
            url: "https://calendly.com/shiladitya-bose/30min",
            text: "Schedule a call",
            color: "#0069ff",
            textColor: "#ffffff",
            branding: true,
          });
        }}
      />
    </>
  );
}
