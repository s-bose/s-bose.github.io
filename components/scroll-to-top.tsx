"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center size-9 rounded-full border border-border bg-background/80 backdrop-blur-md text-muted-foreground hover:text-foreground hover:border-foreground/30 shadow-sm transition-colors duration-200 pointer-events-auto"
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <ArrowUp className="size-3.5" />
    </motion.button>
  );
}
