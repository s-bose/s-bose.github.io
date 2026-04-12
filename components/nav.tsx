"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Monitor, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/blog", label: "BLOG" },
    { href: "https://github.com/s-bose", label: "DEPLOY", external: true },
];

function NavThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon-sm" aria-label="Toggle theme">
                <span className="size-3.5" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground transition-colors"
        >
            {theme === "dark" ? (
                <Sun className="size-3.5" />
            ) : (
                <Monitor className="size-3.5" />
            )}
        </Button>
    );
}

export function Nav() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center justify-between py-6 border-b border-border"
        >
            {/* Brand */}
            <Link
                href="https://github.com/s-bose"
                className="text-xs font-black tracking-[0.2em] text-foreground uppercase hover:opacity-70 transition-opacity duration-200"
            >
                @s-bose
            </Link>

            {/* Links + Toggle */}
            <div className="flex items-center gap-5">
                {navLinks.map((link, i) => (
                    <motion.div
                        key={link.href}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                    >
                        {link.external ? (
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                {link.label}
                            </a>
                        ) : (
                            <Link
                                href={link.href}
                                className={cn(
                                    "text-[11px] font-bold tracking-[0.15em] transition-colors duration-200",
                                    pathname === link.href
                                        ? "text-foreground underline underline-offset-4 decoration-foreground/30"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {link.label}
                            </Link>
                        )}
                    </motion.div>
                ))}
                <NavThemeToggle />
            </div>
        </motion.nav>
    );
}
